jsPlumbToolkit.ready(function() {

    // ------------------------ toolkit setup ------------------------------------

    // This function is what the toolkit will use to get an ID from a node.
    // 这个函数是工具箱用来从节点获取ID的工具。
    var idFunction = function(n) {
        return n.id;
    };

    // This function is what the toolkit will use to get the associated type from a node.
    // 这个函数是工具箱用来从节点获取相关类型的工具。
    var typeFunction = function(n) {
        return n.type;
    };

    // get the various dom elements
    var mainElement = document.querySelector("#jtk-demo"),
        canvasElement = mainElement.querySelector(".jtk-database-canvas"), //canvas区
        miniviewElement = mainElement.querySelector(".database_miniview"), //迷你视图
        nodePalette = mainElement.querySelector(".database_palette"), //侧边栏
        controls = mainElement.querySelector(".database_controls"); //工具栏

    // Declare an instance of the Toolkit, and supply the functions we will use to get ids and types from nodes.
    // 拖拽table或者view生成节点
    var toolkit = jsPlumbToolkit.newInstance({
        idFunction: idFunction,
        typeFunction: typeFunction,
//        nodeFactory: function(type, data, callback) {
//            data.columns = [];
//            jsPlumbToolkit.Dialogs.show({
//                id: "dlgName",
//                title: "输入 " + type + " 名:",
//
//                onMaybeClose: function(d) {
//                    data.name = d.name;
//                    data.table_comment = d.table_comment;
//                    // if the user entered a name...
//                    if (data.name) {
//                        if (data.name.length >= 2) {
//                            // generate an id: replace spaces with underscores, and make lower case
//                            data.id = data.name.replace(" ", "_").toLowerCase();
//                            callback(data);
//                        } else
//                            alert(type + " 名至少大于两个字符!");
//                    }else{
//                        alert("请输入"+type+"名!");
//                        return false;
//                    }
//                    // else...do not proceed.
//                }
//            });
//        },
        edgeFactory: function(params, data, callback) {
            // you must hit the callback if you provide the edgeFactory.
            callback(data);
            // unless you want to return false, to abandon the edge
            //return false;
        },
        //
        // For a given Node, return the parts of its dataset that we want to configure as Ports.
        // This is called when the data is being loaded. It is an optional argument to the newInstance
        // method.
        //
        portExtractor: function(data, node) {
            return data.columns || [];
        },
        //
        // Called after a port is updated, removed or added. Gives us an opportunity to keep the node's backing data
        // up to date with the ports and their data.
        //
        portUpdater: function(data, node, ports) {
            return jsPlumb.extend(data, {
                columns: jsPlumbToolkitUtil.map(ports, function(p) { return p.data; })
            });
        },
        //
        // Prevent connections from a column to itself or to another column on the same table.
        //
        beforeConnect: function(source, target) {
            return source !== target && source.getNode() !== target.getNode();
        }
    });

    // ------------------------ / toolkit setup ------------------------------------

    // ------------------------- dialogs -------------------------------------

    jsPlumbToolkit.Dialogs.initialize({
        selector: ".dlg"
    });

    // ------------------------- / dialogs ----------------------------------


    // ------------------------ rendering ------------------------------------

    // Instruct the toolkit to render to the 'canvas' element. We pass in a model of nodes, edges and ports, which
    // together define the look and feel and behaviour of this renderer.  Note that we can have 0 - N renderers
    // assigned to one instance of the Toolkit..
    var renderer = window.renderer = toolkit.render({
        container: canvasElement,
        enablePan:true,//是否启用平移（通过鼠标拖动）
        enableWheelZoom:true,//是否启用鼠标滚轮缩放。
        enableAnimation:true,//启用平移动画。默认为true。
        wheelZoomMetaKey:false,//如果设置为true,则必须按住ctrl.鼠标滚轮才会触发缩放
        enablePanButtons:false,//是否在边框上显示平移微调按钮
        zoomRange:[0.5,1.5],//缩放范围
        view: {
            // Two node types - 'table' and 'view'
            nodes: {
                "table": {
                    template: "tmplTable",
                    events: {
                        dblclick: function (params) {
                            // openTableWindows(jsPlumb,toolkit,params);
                        }
                    }
                },
                "view": {
                    template: "tmplView"
                }
            },
            // Three edge types  - '1:1', '1:N' and 'N:M',
            // sharing  a common parent, in which the connector type, anchors
            // and appearance is defined.
            edges: {
                "common": {
                    anchor: ["Left", "Right"], // anchors for the endpoints
                    connector: "StateMachine", //  StateMachine connector type
                    cssClass: "common-edge",
                    events: {
                        "dbltap": function(params) {
                            _editEdge(params.edge);
                        }
                    },
                    overlays: [
                        ["Label", {
                            cssClass: "delete-relationship",
                            label: "<i class='fa fa-times'></i>",
                            events: {
                                "tap": function(params) {
                                    toolkit.removeEdge(params.edge);
                                }
                            }
                        }]
                    ]
                },
                // each edge type has its own overlays.
                "1:1": {
                    parent: "common",
                    overlays: [
                        ["Label", { label: "1", location: 0.2 }],
                        ["Label", { label: "1", location: 0.8 }]
                    ]
                },
                "1:N": {
                    parent: "common",
                    overlays: [
                        ["Label", { label: "1", location: 0.2 }],
                        ["Label", { label: "N", location: 0.8 }]
                    ]
                },
                "N:M": {
                    parent: "common",
                    overlays: [
                        ["Label", { label: "N", location: 0.2 }],
                        ["Label", { label: "M", location: 0.8 }]
                    ]
                }
            },
            // There is only one type of Port - a column - so we use the key 'default' for the port type
            // Here we define the appearance of this port,
            // and we instruct the Toolkit what sort of Edge to create when the user drags a new connection
            // from an instance of this port. Note that we here we tell the Toolkit to create an Edge of type
            // 'common' because we don't know the cardinality of a relationship when the user is dragging. Once
            // a new relationship has been established we can ask the user for the cardinality and update the
            // model accordingly.
            ports: {
                "default": {
                    template: "tmplColumn",
                    paintStyle: { fill: "#f76258" }, // the endpoint's appearance
                    hoverPaintStyle: { fill: "#434343" }, // appearance when mouse hovering on endpoint or connection
                    edgeType: "common", // the type of edge for connections from this port type
                    maxConnections: -1, // no limit on connections
                    dropOptions: { //drop options for the port. here we attach a css class.
                        hoverClass: "drop-hover"
                    },
                    allowLoopback: false, // do not allow loopback connections from a port to itself.
                    allowNodeLoopback: false, // do not allow connections from this port to any other port on the same node.
                    events: {
                        dblclick: function (params) {
                            console.log(params);
                        }
                    }
                }
            }
        },
        // Layout the nodes using a 'Spring' (force directed) layout. This is the best layout in the jsPlumbToolkit
        // for an application such as this.
        // Layout the nodes using an absolute layout
        layout: {
            type: "Spring",
            parameters: {
                padding: [80, 80]
            }
        },
        miniview: {
            container: miniviewElement
        },
        // Register for certain events from the renderer. Here we have subscribed to the 'nodeRendered' event,
        // which is fired each time a new node is rendered.  We attach listeners to the 'new column' button
        // in each table node.  'data' has 'node' and 'el' as properties: node is the underlying node data,
        // and el is the DOM element. We also attach listeners to all of the columns.
        // At this point we can use our underlying library to attach event listeners etc.
        events: {
            // This is called by the Toolkit when a new Port is added to a Node. In this application, that occurs
            // when the user adds a new column to a table. It is instigated by the application code preparing the
            // JS data for a new column, and then calling toolkit.portAdded(node, portData); Note that the
            // application also adds the data to the backing model itself.
            // In this application, the portElement was rendered by the 'tmplColumn' template, and it is an LI.
            // the nodeElement was rendered by 'tmplTable', and it has a UL inside of it to which we want to attach
            // the column's LI.
            portAdded: function(params) {
                params.nodeEl.querySelectorAll("ul")[0].appendChild(params.portEl);
            },
            edgeAdded: function(params) {
                // Check here that the edge was not added programmatically, ie. on load.
                if (params.addedByMouse) {
                    _editEdge(params.edge, true);
                }
            },
            canvasClick: function(e) {
                toolkit.clearSelection();
            }
        },
        dragOptions: {
            filter: "i, .view .name span, .table .name span, .table-column *"
        },
        consumeRightClick: false,
        zoomToFit: false
    });

    // listener for mode change on renderer.
    renderer.bind("modeChanged", function(mode) {
        jsPlumb.removeClass(controls.querySelectorAll("[mode]"), "selected-mode");
        jsPlumb.addClass(controls.querySelectorAll("[mode='" + mode + "']"), "selected-mode");
    });


    // ------------------------- behaviour ----------------------------------
    //

    // 删除字段
    // delete column button
    jsPlumb.on(canvasElement, "tap", ".table-column-delete, .table-column-delete i", function() {
        var info = renderer.getObjectInfo(this);
        jsPlumbToolkit.Dialogs.show({
            id: "dlgConfirm",
            data: {
                msg: "Delete column '" + info.id + "'"
            },
            onOK: function(data) {

                var node = info.obj.getNode();//通过字段获取表
                var columns = node.data.columns;
                //columns.removeByValue(data);
                for(var i=0;i<columns.length;i++){
                    if(columns[i].id==info.id){
                        columns.splice(i, 1);
                        break;
                    }
                }
                toolkit.removePort(info.obj.getNode(), info.id);
            },
            onOpen: function(el) {
                console.dir(el);
            }
        });
    });

    //添加字段
    // add new column to table
    jsPlumb.on(canvasElement, "tap", ".new-column, .new-column i", function() {
        var // getObjectInfo is a helper method that retrieves the node or port associated with some
            // element in the DOM.
            info = renderer.getObjectInfo(this);

        jsPlumbToolkit.Dialogs.show({
            id: "dlgColumnEdit",
            title: "添加字段",
            onOK: function(data) {
                // if the user supplied a column name, tell the toolkit to add a new port, providing it the
                // id and name of the new column.  This will result in a callback to the portFactory defined above.
                if (data.id) {
                    if (data.id.length < 2)
                        alert("Column ids must be at least 2 characters!");
                    else {
                        //获取表内 字段数组
                        var columns = info.obj.data.columns;
                        columns.push(data);
                        toolkit.addNewPort(info.id, "column", {
                            id: data.id.replace(" ", "_"),//toLowerCase()
                            primaryKey: data.primaryKey,//主键 rtue|false
                            nullable: data.nullable,//是否为空 rtue|false
                            index: data.index,//索引 rtue|false
                            datatype: data.datatype,//字段类型
                            column_comment: data.column_comment,//字段描述
                            length: data.length,//字段长度
                            default_value: data.default_value//默认值
                        });
                    }
                }
            }
        });
    });

    // 删除表或者视图
    // delete a table or view
    jsPlumb.on(canvasElement, "tap", ".delete i, .view-delete i", function() {
        var info = renderer.getObjectInfo(this);

        jsPlumbToolkit.Dialogs.show({
            id: "dlgConfirm",
            data: {
                msg: "删除 " + info.obj.data.name
            },
            onOK: function(data) {
                toolkit.removeNode(info.id);
            }
        });
    });

    // 编辑一个查询语句
    // edit a view's query
    jsPlumb.on(canvasElement, "tap", ".view .edit i", function() {
        var info = renderer.getObjectInfo(this);
        jsPlumbToolkit.Dialogs.show({
            id: "dlgViewQuery",
            data: info.obj.data,
            onOK: function(data) {
                // update data, and UI (which works only if you use the Toolkit's default template engine, Rotors.
                toolkit.updateNode(info.obj, data);
            }
        });
    });

    // 修改表或视图的名字
    // change a view or table's name
//    jsPlumb.on(canvasElement, "tap", ".view .name span, .table .name span", function() {
//        // getObjectInfo is a method that takes some DOM element (this function's `this` is
//        // set to the element that fired the event) and returns the toolkit data object that
//        // relates to the element.
//        var info = renderer.getObjectInfo(this);
//        jsPlumbToolkit.Dialogs.show({
//            id: "dlgName",
//            data: info.obj.data,
//            title: "修改 " + info.obj.data.type + " 名",
//            onOK: function(data) {
//                if (data.name && data.name.length > 2) {
//                    // if name is at least 2 chars long, update the underlying data and
//                    // update the UI.
//                    toolkit.updateNode(info.obj, data);
//                }
//            }
//        });
//    });

    // 建立主外键关系 1-1, 1-M, M-M
    // edit an edge's detail
    var _editEdge = function(edge, isNew) {
        jsPlumbToolkit.Dialogs.show({
            id: "dlgRelationshipType",
            data: edge.data,
            onOK: function(data) {
                // update the type in the edge's data model...it will be re-rendered.
                // `type` is set in the radio buttons in the dialog template.
                toolkit.updateEdge(edge, data);
            },
            onCancel: function() {
                // if the user pressed cancel on a new edge, delete the edge.
                if (isNew) toolkit.removeEdge(edge);
            }
        });
    };

    // 修改表内字段
    // edit a column's details
    jsPlumb.on(canvasElement, "tap", ".table-column-edit i", function() {
        var info = renderer.getObjectInfo(this);
        jsPlumbToolkit.Dialogs.show({
            id: "dlgColumnEdit",
            title: "修改字段",
            data: info.obj.data,
            onOK: function(data) {
                // if the user supplied a column name, tell the toolkit to add a new port, providing it the
                // id and name of the new column.  This will result in a callback to the portFactory defined above.
                if (data.id) {
                    if (data.id.length < 2)
                        jsPlumbToolkit.Dialogs.show({ id: "dlgMessage", msg: "Column ids must be at least 2 characters!" });
                    else{
                        toolkit.updatePort(info.obj, {
                            id: data.id.replace(" ", "_"),//toLowerCase()
                            primaryKey: data.primaryKey,//主键
                            nullable: data.nullable,//是否为空 rtue|false
                            index: data.index,//索引 rtue|false
                            datatype: data.datatype,//字段类型
                            column_comment: data.column_comment,//字段描述
                            length: data.length,//字段长度
                            default_value: data.default_value//默认值
                        });
                        info.id = data.id;
                        info.obj.id = data.id;
                        console.log(JSON.stringify(info.obj.data));
                    }

                }
            }
        });
    });

    // ------------------------- / behaviour ----------------------------------
    // 选择模式
    // pan mode/select mode
    jsPlumb.on(controls, "tap", "[mode]", function() {
        renderer.setMode(this.getAttribute("mode"));
    });

    // 视图复位
    // on home button click, zoom content to fit.
    jsPlumb.on(controls, "tap", "[reset]", function() {
        toolkit.clearSelection();
        renderer.setZoom(1);
    });

    // ------------------------ / rendering ------------------------------------


    // ------------------------ drag and drop new tables/views -----------------

    //
    // Here, we are registering elements that we will want to drop onto the workspace and have
    // the toolkit recognise them as new nodes.
    //
    //  typeExtractor: this function takes an element and returns to jsPlumb the type of node represented by
    //                 that element. In this application, that information is stored in the 'jtk-node-type' attribute.
    //
    //  dataGenerator: this function takes a node type and returns some default data for that node type.
    //
    renderer.registerDroppableNodes({
        droppables: canvasElement.querySelectorAll("img"),
        dragOptions: {
            zIndex: 50000,
            cursor: "move",
            clone: true
        },
        typeExtractor: function(el, eventInfo, isNativeDrag, eventLocation) {
            return el.getAttribute("jtk-node-type");
        },
        dataGenerator: function(type, draggedElement, eventInfo, eventLocation) {
            return { name: type };
        }
    });

    // ------------------------ / drag and drop new tables/views -----------------

    var datasetView = new jsPlumbSyntaxHighlighter(toolkit, ".jtk-database-dataset");



    //数据导出
    $("body").on('click','.icon-daochu-database',function(){
        var data_html = $('.jtk-database-dataset').html();
        layer.open({
            title: '详细内容',
            shadeClose: false,
            shade: 0.6,
            area: ['60%', '65%'],
            closeBtn: 1,
            content: data_html
        });
    });

    //如果客户端浏览器支持h5,将数据存储在浏览器客户端
    if (typeof(Storage) !== "undefined") {

        var loadData = localStorage.getItem("jkt-database");

        if(loadData!=null){
            // 加载数据.
            toolkit.load({
                data: JSON.parse(loadData)
            });
        }

        //当数据发生变化时触发
        toolkit.bind("dataUpdated", function() {
            var data = toolkit.exportData();
            localStorage.setItem("jkt-database", JSON.stringify(data));
        });
    }

    //点击导出SQL按钮,整合sql的合集。显示出来
    $('.icon-sqlscript').click(function(){
        var allSql = "";
        var nodes = toolkit.getNodes();
        for(var i=0 ; i<nodes.length ; i++){
            allSql = allSql+(nodes[i].data.sql==null?"":nodes[i].data.sql);
        }
        layer.open({
            title: 'SQL内容',
            shadeClose: false,
            shade: 0.6,
            area: ['60%', '65%'],
            closeBtn: 1,
            content: allSql
        });
    });

});

//-------自定义方法start-------




//-------自定义方法end---------