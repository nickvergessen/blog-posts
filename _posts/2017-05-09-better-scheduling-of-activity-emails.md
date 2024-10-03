---
layout: post
title: 📬 Better scheduling of Nextcloud Activity emails
date: 2017-05-09
tags: ['nextcloud', 'activity']
excerpt_separator: <!--more-->
---

With a new console command in the upcoming Nextcloud 12 it is possible to send out the activity emails more regularly than before.

<!--more-->

In certain scenarios it makes sense to send the activity emails out more regularly,
e.g. you want to send the hourly emails always at the full hour, daily emails before
people start to work in the morning and weekly mails shall be send on monday morning,
so people can read up when starting into the week.

Therefor in Nextcloud 12 a console command was added to allow sending those emails
intentionally. This allows to set up special cron jobs on your server with the known
granularity, instead of relying on the Nextcloud cron feature which is not very flexible
on scheduling.

To implement the samples mentioned above, the following three entries are necessary:

```
# crontab -u www-data -e
 0  *  *  *  *    php -f /var/www/nextcloud/occ activity:send-mails hourly
30  7  *  *  *    php -f /var/www/nextcloud/occ activity:send-mails daily
30  7  *  *  MON  php -f /var/www/nextcloud/occ activity:send-mails weekly
```

If you want to manually send out all activity emails which are queued, you can run
`occ activity:send-mails` without any argument.