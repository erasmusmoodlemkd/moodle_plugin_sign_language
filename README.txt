This block allow to use sign language videos on Moodle site by using specific videos uploaded on YouTube.

How to use it ?
1/ Install the block like other blocks
2/ Visit the Administration > Site administration > Appearance > Additionnal HTML (MY_MOODLE_SITE.com/admin/settings.php?section=additionalhtml)
3/ Adapt this code (change MY_MOODLE_SITE.com with your domain) and paste it into the « Within HEAD » area :

 <!-- Begin of Sign Language mod -->
<link rel="stylesheet" type="text/css" href="http://lms.fzf.ukim.edu.mk/blocks/sign_language/sign_language.css">
 <script src="MY_MOODLE_SITE.com/blocks/sign_language/jquery.min.js"></script>
 <script src="MY_MOODLE_SITE.com/blocks/sign_language/jquery.tmpl.js"></script>
 <script src="MY_MOODLE_SITE.com/blocks/sign_language/sign_language.js"></script>
 <!-- End of Sign Language mod -->

4/ Insert the block into your site, on the first page if you want
5/ Test & enjoy




