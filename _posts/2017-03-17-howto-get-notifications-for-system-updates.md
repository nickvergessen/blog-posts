---
layout: post
title: Howto get notifications for system updates
date: 2017-03-17
tags: ['nextcloud', 'notifications']
excerpt_separator: <!--more-->
---

Keep your server up to date and receive a [notification](https://github.com/nextcloud/notifications) in your [Nextcloud](https://nextcloud.com) when php, apache, etc. need an update with this little script.

**Update 21/Apr/17:** Also works on Raspbian and others now.

<!--more-->

> ![Notifications for system updates]({{ site.url }}/assets/posts/notifications-system-update.png)

1. Install the [admin_notifications](https://apps.nextcloud.com/apps/admin_notifications) app
2. Create `system-notifications.sh` with the following content on your system, and make sure to adjust the path to your nextcloud `/var/www/nextcloud/occ` as well as your admin account name:

    ```sh
    #!/usr/bin/env bash
    #
    # @license MIT
    # @copyright 2017 Joas Schilling coding@schilljs.com

    ADMIN="admin"
    OCC_PATH="/var/www/nextcloud/occ"

    PACKAGES=$(/usr/lib/update-notifier/apt-check -p 2>&1)
    NUM_PACKAGES=$(echo "$PACKAGES" | wc -l)

    if [ "$PACKAGES" != "" ]; then
    	UPDATE_MESSAGE=$(echo "Packages to update: $PACKAGES" | sed -r ':a;N;$!ba;s/\n/, /g')
    	$OCC_PATH notification:generate $ADMIN "$NUM_PACKAGES packages require to be updated" -l "$UPDATE_MESSAGE"

    elif [ -f /var/run/reboot-required ]; then
    	$OCC_PATH notification:generate $ADMIN "System requires a reboot"
    fi
    ```

3. Add the script to the cronjob `crontab -u www-data -e`

    ```sh
    0 10 * * * /path/to/file/system-notifications.sh
    ```

Leave comments in the [Nextcloud forum](https://help.nextcloud.com/t/howto-get-notifications-for-system-updates/10299).

### [Update] Raspbian and other systems

If your operating system does not support `apt-check`, you can also try to replace the line:

```bash
PACKAGES=$(/usr/lib/update-notifier/apt-check -p 2>&1)
```

with:

```bash
PACKAGES=$(apt-get -s dist-upgrade | awk '/^Inst/ { print $2 }' 2>&1)
```

This at least made it work on my Raspberry Pi which runs Raspbian.
