<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Backbone Demo</title>
<style>
	html,body{
		height: 100%;
		width : 100%;
		margin: 0;
		padding: 0;
		font-size: 12px;
	}
	input.username{
		width : 80px;
	}
	input.age{
		width : 30px;
	}
	select.sex{
		width : 45px;
	}
	.emp-table{
		width: 100%;
		text-align: center;
	}
	.emp-table tr{
		height: 30px;
	}
	.emp-table td .edit{
		display: none;
	}
	.emp-table td.editing .edit{
		display: block;
	}
	.emp-table td.editing .display{
		display: none;
	}
</style>
</head>
<body>
	<div style="width: 650px;margin: 0 auto;" id="app">
		<p id="emp-form">
			<label for="username">姓名：</label>
			<input id="username" class="username" name="username"/>
			<label for="sex">性别：</label>
			<select id="sex" name="sex" class="sex">
				<option value="0">男</option>
				<option value="1">女</option>
			</select>
			<label for="age">年龄：</label>
			<input id="age" name="age" class="age"/>
			<label for="position">职位：</label>
			<input id="position" name="position" class="position" />
			<button id="add-btn">增加</button>
		</p>
		<table class="emp-table" border="1" cellspacing="0" cellpadding="0">
			<caption style="font-size: 14px;font-weight: bold;">职员信息表（双击编辑）</caption>
			<thead>
				<tr>
					<th>ID</th>
					<th>姓名</th>
					<th>性别</th>
					<th>年龄</th>
					<th>职位</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
		<div id="pager"></div>
		<script type="text/javascript" src="${staticServePath}/js/lib/jquery/jquery.min.js" charset="utf-8"></script>
	    <script type="text/javascript" src="${staticServePath}/js/lib/backbone/underscore-1.1.6.js"></script>
		<script type="text/javascript" src="${staticServePath}/js/lib/backbone/backbone.js"></script>
		<script type="text/javascript" src="${staticServePath}/js/lib/backbone/backbone-localstorage.js"></script>
		<script type="text/javascript" src="${staticServePath}/js/app.js"></script>
	    <script type="text/template" id="item-template">
 					<td><%= eid %></td>
					<td class="username"><div class="display"><%= username %></div><div class="edit"><input class="username" name="username"></input></div></td>
					<td class="sex"><div class="display"><%= sex=="1" ? "女":"男" %></div><div class="edit"><select name="sex" class="sex" style="width:45px"><option value="0">男</option><option value="1">女</option></select></div></td>
					<td class="age"><div class="display"><%= age %></div><div class="edit"><input class="age" name="age"></input></div></td>
					<td class="position"><div class="display"><%= position %></div><div class="edit"><input class="position" name="position"></input></div></td>
					<td><a href="#" class="del">删除</a></td>
    	</script>
	</div>
</body>
</html>