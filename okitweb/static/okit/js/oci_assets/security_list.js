console.log('Loaded Subnet Javascript');

/*
** Set Valid drop Targets
 */

asset_drop_targets["Security List"] = ["Virtual Cloud Network"];
asset_add_functions["Security List"] = "addSecurityList";

var security_list_ids = [];
var security_list_count = 0;
var security_list_prefix = 'sl';

/*
** Reset variables
 */

function clearSecurityListVariables() {
    security_list_ids = [];
    security_list_count = 0;
}

/*
** Add Asset to JSON Model
 */
function addSecurityList(vcnid) {
    var id = 'okit-sl-' + uuidv4();

    // Add Virtual Cloud Network to JSON

    if (!('security_lists' in OKITJsonObj['compartment'])) {
        OKITJsonObj['compartment']['security_lists'] = [];
    }

    // Add id & empty name to id JSON
    okitIdsJsonObj[id] = '';
    security_list_ids.push(id);

    // Increment Count
    security_list_count += 1;
    var security_list = {};
    security_list['vcn_id'] = vcnid;
    security_list['virtual_cloud_network'] = '';
    security_list['id'] = id;
    security_list['display_name'] = generateDefaultName(security_list_prefix, security_list_count);
    security_list['egress_security_rules'] = []
    security_list['ingress_security_rules'] = []
    OKITJsonObj['compartment']['security_lists'].push(security_list);
    okitIdsJsonObj[id] = security_list['display_name'];
    console.log(JSON.stringify(OKITJsonObj, null, 2));
    console.log(security_list_ids);
    displayOkitJson();
    drawSecurityListSVG(security_list);
}

/*
** SVG Creation
 */
function drawSecurityListSVG(security_list) {
    var vcnid = security_list['vcn_id'];
    var id = security_list['id'];
    var position = vcn_element_icon_position;
    var translate_x = icon_translate_x_start + icon_width * position + vcn_icon_spacing * position;
    var translate_y = icon_translate_y_start;
    var svg_x = (icon_width / 2) + (icon_width * position) + (vcn_icon_spacing * position);
    var svg_y = (icon_height / 4) * 3;
    var data_type = "Security List";

    // Increment Icon Position
    vcn_element_icon_position += 1;

    var okitcanvas_svg = d3.select('#' + vcnid + "-svg");
    var svg = okitcanvas_svg.append("svg")
        .attr("id", id + '-svg')
        .attr("data-type", data_type)
        .attr("data-vcnid", vcnid)
        .attr("title", security_list['display_name'])
        .attr("x", svg_x)
        .attr("y", svg_y)
        .attr("width", "100")
        .attr("height", "100");
    var rect = svg.append("rect")
        .attr("id", id)
        .attr("data-type", data_type)
        .attr("data-vcnid", vcnid)
        .attr("title", security_list['display_name'])
        .attr("x", icon_x)
        .attr("y", icon_y)
        .attr("width", icon_width)
        .attr("height", icon_height)
        .attr("stroke", icon_stroke_colour)
        .attr("stroke-dasharray", "1, 1")
        .attr("fill", "white")
        .attr("style", "fill-opacity: .25;");
    rect.append("title")
        .text("Security List: " + security_list['display_name']);
    var g = svg.append("g")
        .attr("transform", "translate(5, 5) scale(0.3, 0.3)");
    g.append("path")
        .attr("class", "st0")
        .attr("d", "M144,85.5l-43.8,18.8v41.8v0.1c1.3,23.2,18.4,43.6,43.8,56.3c25.5-12.7,42.5-33.1,43.8-56.3v-0.1v-41.8L144,85.5z M151.3,161.8h-31.5v-4.3h31.5V161.8z M151.3,144.7h-31.5v-4.3h31.5V144.7z M151.3,126.6h-31.5v-4.3h31.5V126.6zM170.4,155.8l-7.7,7.7l-4.9-4.9c-0.6-0.6-0.6-1.5,0-2c0.6-0.6,1.5-0.6,2,0l2.8,2.8l5.6-5.6c0.6-0.6,1.5-0.6,2,0C171,154.3,171,155.2,170.4,155.8z M159.4,138.6c-0.6-0.6-0.6-1.5,0-2c0.6-0.6,1.5-0.6,2,0l3,3l3-3c0.6-0.6,1.5-0.6,2,0c0.6,0.6,0.6,1.5,0,2l-3,3l3,3c0.6,0.6,0.6,1.5,0,2c-0.3,0.3-0.6,0.4-1,0.4c-0.4,0-0.7-0.1-1-0.4l-3-3l-3,3c-0.3,0.3-0.6,0.4-1,0.4c-0.4,0-0.7-0.1-1-0.4c-0.6-0.6-0.6-1.5,0-2l3-3L159.4,138.6z M170.7,121.9l-7.7,7.7l-4.9-4.9c-0.6-0.6-0.6-1.5,0-2c0.6-0.6,1.5-0.6,2,0l2.8,2.8l5.6-5.6c0.6-0.6,1.5-0.6,2,0C171.2,120.4,171.2,121.3,170.7,121.9z")

    // Add click event to display properties
    $('#' + id).on("click", function() { loadSecurityListProperties(id) });
    d3.select('svg#' + id + '-svg').selectAll('path')
        .on("click", function() { loadSecurityListProperties(id) });
    loadSecurityListProperties(id);

    // Add Drag Event to allow connector (Currently done a mouse events because SVG does not have drag version)
    $('#' + id).on("mousedown", handleConnectorDragStart);
    //$('#' + id).on("mousemove", handleConnectorDrag);
    $('#' + id).on("mouseup", handleConnectorDrop);
    $('#' + id).on("mouseover", handleConnectorDragEnter);
    $('#' + id).on("mouseout", handleConnectorDragLeave);
    // Add dragevent versions
    $('#' + id).on("dragstart", handleConnectorDragStart);
    $('#' + id).on("drop", handleConnectorDrop);
    $('#' + id).on("dragenter", handleConnectorDragEnter);
    $('#' + id).on("dragleave", handleConnectorDragLeave);
    d3.select('#' + id)
        .attr("dragable", true);
}

/*
** Property Sheet Load function
 */
function loadSecurityListProperties(id) {
    $("#properties").load("propertysheets/security_list.html", function () {
        if ('compartment' in OKITJsonObj && 'security_lists' in OKITJsonObj['compartment']) {
            console.log('Loading Security List: ' + id);
            var json = OKITJsonObj['compartment']['security_lists'];
            for (var i = 0; i < json.length; i++) {
                security_list = json[i];
                //console.log(JSON.stringify(security_list, null, 2));
                if (security_list['id'] == id) {
                    //console.log('Found Security List: ' + id);
                    security_list['virtual_cloud_network'] = okitIdsJsonObj[security_list['vcn_id']];
                    $("#virtual_cloud_network").html(security_list['virtual_cloud_network']);
                    $('#display_name').val(security_list['display_name']);
                    var inputfields = document.querySelectorAll('.property-editor-table input');
                    [].forEach.call(inputfields, function (inputfield) {
                        inputfield.addEventListener('change', function () {
                            security_list[inputfield.id] = inputfield.value;
                            // If this is the name field copy to the Ids Map
                            if (inputfield.id == 'display_name') {
                                okitIdsJsonObj[id] = inputfield.value;
                            }
                            displayOkitJson();
                        });
                    });
                    // Egress Rules
                    for (var rulecnt = 0; rulecnt < security_list['egress_security_rules'].length; rulecnt++) {
                        addAccessRuleHtml(security_list['egress_security_rules'][rulecnt], 'egress')
                    }
                    // Ingress Rules
                    for (var rulecnt = 0; rulecnt < security_list['ingress_security_rules'].length; rulecnt++) {
                        addAccessRuleHtml(security_list['ingress_security_rules'][rulecnt], 'ingress')
                    }
                    // Add Handler to Add Button
                    document.getElementById('egress_add_button').addEventListener('click', handleAddAccessRule, false);
                    document.getElementById('egress_add_button').security_list = security_list;
                    document.getElementById('ingress_add_button').addEventListener('click', handleAddAccessRule, false);
                    document.getElementById('ingress_add_button').security_list = security_list;
                    break;
                }
            }
        }
    });
}

function addAccessRuleHtml(access_rule, access_type) {
    if (access_type == 'egress') {
        var rules_table_body = d3.select('#egress_rules_table_body');
        var rules_count = $('#egress_rules_table_body > tr').length;
        var source_dest = 'destination';
        var source_dest_title = 'Destination';
    } else {
        var rules_table_body = d3.select('#ingress_rules_table_body');
        var rules_count = $('#ingress_rules_table_body > tr').length;
        var source_dest = 'source';
        var source_dest_title = 'Source';
    }
    var rule_num = rules_count + 1;
    var row = rules_table_body.append('tr');
    var cell = row.append('td')
        .attr("id", "rule_" + rule_num)
        .attr("colspan", "2");
    var rule_table = cell.append('table')
        .attr("id", "rule_table_" + rule_num)
        .attr("class", "property-editor-table");
    // First Row with Delete Button
    var rule_row = rule_table.append('tr');
    var rule_cell = rule_row.append('td')
        .attr("colspan", "2");
    rule_cell.append('input')
        .attr("type", "button")
        .attr("class", "delete-button")
        .attr("value", "-")
        .attr("onclick", "handleDeleteRouteRulesRow(this)");
    // Destination / Source Type
    rule_row = rule_table.append('tr');
    rule_cell = rule_row.append('td')
        .text(source_dest_title + " Type");
    rule_cell = rule_row.append('td');
    rule_cell.append('input')
        .attr("type", "text")
        .attr("class", "property-value")
        .attr("readonly", "readonly")
        .attr("id", source_dest + "_type")
        .attr("name", source_dest + "_type")
        .attr("value", access_rule[source_dest + '_type'])
        .on("change", function() {
            access_rule[source_dest + '_type'] = this.value;
            displayOkitJson();
        });
    // Stateful
    rule_row = rule_table.append('tr');
    rule_cell = rule_row.append('td');
    rule_cell = rule_row.append('td');
    rule_cell.append('input')
        .attr("type", "checkbox")
        .attr("class", "property-value")
        .attr("id", "is_stateless")
        .attr("name", "is_stateless")
        .on("change", function() {
            access_rule['is_stateless'] = this.checked;
            console.log('Changed is_stateless: ' + this.checked);
            displayOkitJson();
        });
    if (access_rule['is_stateless']) {
        rule_cell.attr("checked", access_rule['is_stateless']);
    }
    rule_cell.append('label')
        .attr("class", "property-value")
        .text('Stateless');
    // Destination / Source
    rule_row = rule_table.append('tr');
    rule_cell = rule_row.append('td')
        .text(source_dest_title);
    rule_cell = rule_row.append('td');
    rule_cell.append('input')
        .attr("type", "text")
        .attr("class", "property-value")
        .attr("id", source_dest)
        .attr("name", source_dest)
        .attr("value", access_rule[source_dest])
        .on("change", function() {
            access_rule[source_dest] = this.value;
            console.log('Changed destination: ' + this.value);
            displayOkitJson();
        });
    // Add Protocol
    rule_row = rule_table.append('tr');
    rule_cell = rule_row.append('td')
        .text("Protocol");
    rule_cell = rule_row.append('td');
    var protocol_select = rule_cell.append('select')
        .attr("class", "property-value")
        .attr("id", "protocol")
        .on("change", function() {
            access_rule['protocol'] = this.options[this.selectedIndex].value;
            console.log('Changed network_entity_id ' + this.selectedIndex);
            displayOkitJson();
        });
    // Add Protocol Options
    var protocols = {
        'All': 'all',
        'ICMP': '1',
        'TCP': '6',
        'UDP': '17'
    };
    for (var key in protocols) {
        if (protocols.hasOwnProperty(key)) {
            var opt = protocol_select.append('option')
                .attr("value", protocols[key])
                .text(key);
            if (access_rule['protocol'] == protocols[key]) {
                opt.attr("selected", "selected");
            }
        }
    }
    if (access_rule['protocol'] == '') {
        access_rule['protocol'] = protocol_select.node().options[protocol_select.node().selectedIndex].value;
    }
}

function handleAddAccessRule(evt) {
    console.log('Adding access rule');
    var new_rule = { "protocol": "all", "is_stateless": false}
    if (evt.target.id == 'egress_add_button') {
        new_rule["destination_type"] = "CIDR_BLOCK";
        new_rule["destination"] = "0.0.0.0/0";
        evt.target.security_list['egress_security_rules'].push(new_rule)
    } else {
        new_rule["source_type"] = "CIDR_BLOCK";
        new_rule["source"] = "0.0.0.0/0";
        evt.target.security_list['ingress_security_rules'].push(new_rule)
    }
    addAccessRuleHtml(new_rule, evt.target.id.split('_')[0]);
    displayOkitJson();
}

function handleDeleteRouteRulesRow(btn) {
    var row = btn.parentNode.parentNode.parentNode.parentNode.parentNode;
    row.parentNode.removeChild(row);
}


clearSecurityListVariables();