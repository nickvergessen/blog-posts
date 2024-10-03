---
layout: post
title: 🏬 Migrations for Nextcloud apps
date: 2017-09-08
tags: ['nextcloud']
excerpt_separator: <!--more-->
---

In Nextcloud 13 we added migrations for database changes, allowing apps a more granular updating mechanism.

<!--more-->

Until now apps had a `appinfo/database.xml` file which holds their database schema for installation and update. Here is an example from the [twofactor_backupcodes app](https://github.com/nextcloud/server/blob/d89d96203affc8ae1cb0dd7da061bd2e853811b7/apps/twofactor_backupcodes/appinfo/database.xml):

```xml
<?xml version="1.0" encoding="ISO-8859-1" ?>
<database>
	<name>*dbname*</name>
	<create>true</create>
	<overwrite>false</overwrite>
	<charset>utf8</charset>
	<table>
		<name>*dbprefix*twofactor_backupcodes</name>
		<declaration>
			<field>
				<name>id</name>
				<type>integer</type>
				<autoincrement>1</autoincrement>
				<default>0</default>
				<notnull>true</notnull>
				<length>4</length>
			</field>
...

```



While for installing this was quite okay, it always had troubles when dealing with upgrades. E.g. apps were not able to rename columns without loosing the data stored in the original column. This is because the changes were executed in one go, without giving the app the possibility to do stuff in between.

For Nextcloud 13 we therefor introduce **migrations**. Migrations basically consist of 3 methods:

1. Pre schema changes
2. Actual schema changes
3. Post schema changes



Since an app can have multiple migrations, the system allows for a way more flexible update. E.g. renaming a column while copying all the content can be solved with 3 steps in 2 migrations:

1. Migration 1 - Schema change: create the new column

   ```php
   	public function changeSchema(IOutput $output, \Closure $schemaClosure, array $options) {
   		/** @var Schema $schema */
   		$schema = $schemaClosure();

   		$table = $schema->getTable('twofactor_backupcodes');

   		$table->addColumn('user_id', Type::STRING, [
   			'notnull' => true,
   			'length' => 64,
   		]);

   		return $schema;
   	}
   ```

   ​

2. Migration 1 - Post schema change: copy content from old to new column (could also be done in "Migration 2 - Pre schema change")

   ```php
   	public function postSchemaChange(IOutput $output, \Closure $schemaClosure, array $options) {
   		$query = $this->db->getQueryBuilder();
   		$query->update('twofactor_backupcodes')
   			->set('user_id', 'uid');
   		$query->execute();
   	}
   ```

   ​

3. Migration 2 - Schema change: remove the old column

   ```php
   	public function changeSchema(IOutput $output, \Closure $schemaClosure, array $options) {
   		/** @var Schema $schema */
   		$schema = $schemaClosure();

   		$table = $schema->getTable('twofactor_backupcodes');
   		$table->dropColumn('uid');

   		return $schema;
   	}
   ```

   ​



**Note:** While in theory you can run any code in the pre- and post-steps, we recommend not to use actual php classes. WIth migrations you can update from any old version to any new version as long as the migration steps are retained. Since they are also used for installation, you should keep them anyway. But this also means when you change a php class which you use in your migration, the code may be executed on different database/file/code standings when being ran in an upgrade situation.

**Note:** Since Nextcloud stores, which migrations have been executed already you must not "update" migrations. The recommendation is to keep them untouched as long as possible. You should only adjust it to make sure it still executes, but additional changes to the database should be done in a new migration.



There are also some new console commands, which should help developers to create and deal with migrations, note that some are only available when running debug mode:

```
  migrations:execute                  Execute a single migration version manually.
  migrations:generate
  migrations:migrate                  Execute a migration to a specified version or the latest available version.
  migrations:status                   View the status of a set of migrations.
```



The most important one should be the `migration:generate` one. It needs to be used to create a new migration file. The command takes 2 arguments, first one is the `appid` , the second one should be the `version` of your app as an integer. We recommend to use the major and minor digits of your apps version for that. This allows you to introduce a new migration in your Nextcloud 13 branch, while there is already an Nextcloud 14 migration in a second branch. Since you can't change this retroactive, we recommend to leave enough space in between and therefor map the numbers to 3 digits: `1.0.x` => `1000`, `2.34.x` => `2034`, etc.



After creating migrations for your current database and installation routine, the only thing you need to do in order to make use of migrations, is to delete the old `appinfo/database.xml` file. The Nextcloud installer/updater logic only allows to use one or the other. But as soon as the `database.xml` file is gone, it will look for your migration files in the apps `lib/Migration` folder.



Some example Pull Requests:

* [twofactor_backupcodes app](https://github.com/nextcloud/server/pull/5231)
* [dav app](https://github.com/nextcloud/server/pull/6264)
* [oc_accounts table problem](https://github.com/nextcloud/server/pull/6097)
* [video calls app](https://github.com/nextcloud/spreed/pull/352)



I hope this helps you to get started with migrations.



