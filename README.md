**How it works** 
First allow https://okilele-newbie.github.io to read/write access mode to your Pod  
Then:  
Very simple, enter a text, click on "Add Note" and you see it in the list. Waouh!  
The note (or actually the post) is in your public/shoutbox folder but anybody connected to the shoutbox can see it.
That's it!

So Shoutbox can read and also edit data in any Pod! Nothing really new or surprising but Shoutbox can easily do it using funcitonnalities provided by Solid combined with a central index.

So play around with this tool (you should not spend a lot of time...), enjoy and let us know if the central tag index idea worth growing up ...

**Technical information**
- Pages include content from Solid using https and also:
  - data from CouchDb and this is active mixed content as the CouchDb server is not https.
  - cross-origin content as  the CouchDb server has its own IP.    
Browsers don't like !  
In order to fix this:
  - Chrome/Opera: Just allow blocked content when prompted.
  - Firefox: Allowing mixed content is easy in about:config parameters. It should be the same for Cors with the content.cors.disable parameter but this doesn't work ...
  - IE/Edge : Does not work, I did not investigate  
So, at least for those tests, please use Chrome or Opera (same engine).

- Users using Shoutbox can read ... and also edit files from other Pods.
  - You added https://okilele-newbie.github.io to trusted apps. By default this means other can read your Pod/public and only you can write.
  - If you want to OTHER write on your Pod you must grant "something"* write access to /public/shoutbox folder. Take care if you do so, edited posts will appear on behalf on you!    
  
  *"something": I thougt this should be the application but this does not work, neither other users webid. Only "everyone" (with the globe icon) works.
  
