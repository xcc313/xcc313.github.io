<#include "macro-head.ftl">
<!DOCTYPE html>
<html>
    <head>
        <@head title="${blogTitle}">
        <meta name="keywords" content="${metaKeywords}"/>
        <meta name="description" content="<#list articles as article>${article.articleTitle}<#if article_has_next>,</#if></#list>"/>
        </@head>
    </head>
    <body>
        <#include "navbar.ftl">
        <!-- Docs page layout -->
	    <div class="bs-header" id="content">
	      <div class="container">
	        <h1>Idonote</h1>
	        <p>Idonote 起步成长中，让我们共同建筑梦想：）。</p>
	      </div>
	    </div>
        <#include "container.ftl">
        <#include "footer.ftl">
    </body>
</html>
