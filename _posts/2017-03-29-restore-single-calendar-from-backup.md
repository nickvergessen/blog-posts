---
layout: post
title: Restore a single calendar from a Nextcloud backup
date: 2017-03-29
tags: ['nextcloud', 'calendar']
excerpt_separator: <!--more-->
---

I expirienced an issue with one of my CalDAV clients, which deleted some events from my calendar.
So I restored the data of that one calendar from the latest backup before the malicious client got connected.

<!--more-->

To achieve this only seven little steps are necessary:

1. Remove unrelated calendars from the backup

    ```sql
    DELETE FROM oc_calendars WHERE id NOT IN (1, 5, 3, 12, 22, 33, 34);
    DELETE FROM oc_dav_shares WHERE type <> 'calendar' OR resourceid NOT IN (1, 3, 5, 12, 22, 33, 34);
    DELETE FROM oc_calendarobjects WHERE calendarid NOT IN (1, 3, 5, 12, 22, 33, 34);
    DELETE FROM oc_calendarchanges WHERE calendarid NOT IN (1, 3, 5, 12, 22, 33, 34);
    ```

2. Save the rescued calendar alone

    Now backup (**data only**) the content of the 4 tables as `rescue.sql`.

3. Backup the calendars live data

    ```sql
    CREATE TABLE backup_calendars AS SELECT * FROM oc_calendars;
    ```

4. Delete the affected calendars on the live database

    ```sql
    DELETE FROM oc_calendars WHERE id IN (1, 3, 5, 12, 22, 33, 34);
    DELETE FROM oc_dav_shares WHERE type = 'calendar' AND resourceid IN (1, 3, 5, 12, 22, 33, 34);
    DELETE FROM oc_calendarobjects WHERE calendarid IN (1, 3, 5, 12, 22, 33, 34);
    DELETE FROM oc_calendarchanges WHERE calendarid IN (1, 3, 5, 12, 22, 33, 34);
    ```

5. Restore the rescue on the live database

    ```sh
    mysql -u root -p nextcloud < rescue.sql
    ```

6. Reset the sync token to a higher value than before

    ```sql
    UPDATE oc_calendars l
    JOIN backup_calendars b ON (l.id = b.id)
    SET l.synctoken = b.synctoken + 1
    WHERE l.id IN (1, 3, 5, 12, 22, 33, 34);
    ```

7. Delete the backup table

    ```sql
    DROP TABLE backup_calendars;
    ```

