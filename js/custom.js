/**
 * [parseId ]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function parseId(id){
	let result =  id.replace('_', '');
	return parseInt(result);
}

/**
 * [filterData]
 * @param  {[type]} data [description]
 * @param  {[type]} Gid  [description]
 * @return {[type]}      [description]
 */
function filterData(children) {
	let result = [];
	for (let i = 0; i < children.length; i++) {
		let id  = parseId(children[i].id);
		let item =  {'id': id, "text": children[i].NAME,"icon": 'fa fa-lg fa-folder'}
		let subChild = children[i].children;
		if(subChild && subChild.length > 0){
			filterData(children[i].children) 
		}
		result.push(item);
	}
	// let result = children.map((item,index)=>{
	// 	let id  = parseId(item.id);
	// 	return {'id': id, "text": item.NAME,"icon": 'fa fa-lg fa-folder'};
	// })
	// console.log(result);
	return result;
}



$(document).ready(function() {	
	$('#jstree_airo').jstree({
		'core': {
			'data': function (node, cb) {
				$.ajax({
					// url: "http://d-inspector.isoftone.com/data.php?func=SelectTreeGroup"
					url: "http://dev-metrov.isoftone.com:8080/data.php?func=RequestTreeGroup&Act=perform&GID=0"
				}).done(function (data) {
					console.log(data);
					var data = data.Record;
					var children = data[0].children;

					var a = [];
					for (j = 0; j < data.length; j++) {
						var PGid = data[j].parent_id;
						var Gid = data[j].GID;
						var GName = data[j].NAME;
						if (Gid == 0) {
							a.push(
							{
								id: Gid,
								text: GName,
								a_attr: {gid:Gid},
								icon: 'fa fa-lg fa-server',
								children: filterData(children)
							}
							)
						}
					}
					cb(a);
				})
			},
			"check_callback": true
		},
		"search": {
			"case_insensitive": true,
			"show_only_matches": true
		},
		"contextmenu": {
			'items': function ($node) {
				var tree = $("#treeview_json").jstree(true);
				return {
					"Create": {
						"label": "Create",
						"action": function (data) {
							var inst = $.jstree.reference(data.reference),
							obj = inst.get_node(data.reference);
							inst.create_node(obj, {}, "last", function (new_node) {
								inst.edit(new_node, null, function () {
									$.ajax({
										type: 'POST',
										url: "",
										dataType: 'json',
										data: {
											Gid: "17",
											GName: new_node.text,
											PGid: new_node.parent,
											Rank: "7"
										},
										success: function (result) {
											console.log('Ok')
										}
									})
								});
							});
						}
					},
					"remove": {
						"label": "Delete",
						"action": function (data) {
							var inst = $.jstree.reference(data.reference),
							obj = inst.get_node(data.reference);
							if (inst.is_selected(obj)) {
								inst.delete_node(
									$.ajax({
										type: "POST",
										url: "",
										dataType: 'json',
										data: {
											Gid: inst.get_selected()[0],
											Deleted: 1,
										},
										success: function (result) {
											console.log('Delete Complete!')
										}
									})
									);
							}
							else {
								inst.delete_node(obj);
							}
						}
					},
					"rename": {
						"label": "Rename",
						"action": function (data) {
							var inst = $.jstree.reference(data.reference),
							obj = inst.get_node(data.reference);
							inst.edit(
								$.ajax({
									type: "POST",
									url: "",
									dataType: 'json',
									data: {
										Gid: inst.get_selected()[0],
										Deleted: 1,
									},
									success: function (result) {
										console.log('Delete Complete!')
									}
								})
								);
						}
					}
				}
			}
		},
		plugins: ["search", "contextmenu", 'core']
	})
	.bind("select_node.jstree", function (e, data) {
		$("#input_GId").val(data.node.a_attr.gid);
		alert(data.node.a_attr.gid);
	})

	.bind("loaded.jstree", function (e, data) {
		$(this).jstree("open_all");
	});

});