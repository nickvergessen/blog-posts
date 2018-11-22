---
layout: post
title: Save LibreOffice documents directly to Nextcloud
date: 2018-11-22
tags: ['nextcloud']
excerpt_separator: <!--more-->
---

Configure your LibreOffice to be able to load and save documents directly from and to your Nextcloud by configuring it as a remote server.

<!--more-->

# Configuring Nextcloud as Remote location for LibreOffice

Since quite some time LibreOffice allows to interact with documents from remote servers.
Using the WebDAV feature this can be connected to your Nextcloud. To configure your LibreOffice follow these steps:

## Open LibreOffice

1. `File` > `Open Remote`
2. Add service

    * Type: `WebDAV`
    * Host: `cloud.yourdomain.com` (check save connection when you use https to access the site)
    * Port: `80` (also when you use https)
    * Label: `My Nextcloud`
    * Root: `/remote.php/webdav/`
3. Leave the newly opened "Authentication Required" window open and go to your Nextcloud 

## Open Nextcloud

  1. Go to the `Settings` > `Security`
    `https://cloud.yourdomain.com/index.php/settings/user/security`
  2. In `Devices & sessions` create a new app password
  3. Copy the generated password: `aaaaa-aaaaa-aaaaa-aaaaa-aaaaa`

## Back to LibreOffice

1. In the "Authentication Required" popup enter:

    * User: `name` (Your login ID from nextcloud)
    * Password: `aaaaa-aaaaa-aaaaa-aaaaa-aaaaa` (the string you copied from in 2.3)

And done, your files should now be listed:

> ![Remote file list]({{ site.blog_url }}/assets/posts/libreoffice-remote-files.png)

You can now save files to your Nextcloud with the "Save Remote …" option and open files from your Nextcloud with the "Open Remote …" option.
