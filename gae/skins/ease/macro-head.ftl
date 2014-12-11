<#macro head title>
        <meta charset="utf-8" />
        <title>${title}</title>
<#nested>
        <meta name="author" content="${blogTitle?html}" />
        <meta name="revised" content="${blogTitle?html}, ${year}" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="robots" content="index,follow">
        <meta name="application-name" content="app.idonote.com">
        <meta http-equiv="Window-target" content="_top" />
  <!-- Site CSS -->
   <link href="${staticServePath}/css/bootstrap.min.css" rel="stylesheet">
   <link type="text/css" rel="stylesheet" href="${staticServePath}/skins/${skinDirName}/css/docs.css?${staticResourceVersion}" charset="utf-8" />
   <link type="text/css" rel="stylesheet" href="${staticServePath}/skins/${skinDirName}/timeline/timeline.css?${staticResourceVersion}" charset="utf-8" />
   <link type="text/css" rel="stylesheet" href="${staticServePath}/skins/${skinDirName}/css/ease.min.css?${staticResourceVersion}" charset="utf-8" />
   <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
   <!--[if lt IE 9]>
    <script src="${staticServePath}/js/html5shiv.js"></script>
    <script src="${staticServePath}/js/respond.min.js"></script>
   <![endif]-->
  

	<link href="${servePath}/blog-articles-feed.do" title="ATOM" type="application/atom+xml" rel="alternate" />
	<link rel="icon" type="image/png" href="${staticServePath}/favicon.png" />
	${htmlHead}
</#macro>