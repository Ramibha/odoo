odoo.define('dynamic_tree_views.shcolumns', function(require) {
    "use strict";

var core = require('web.core');
var ListRenderer = require('web.ListRenderer');
var QWeb = core.qweb;


ListRenderer.include({
    events: _.extend({}, ListRenderer.prototype.events, {
        'click .o_optional_columns_dropdown_toggle': function () {
            $("#show-menu").show();
        },
        'change .columnCheckbox': function (event) {
           this.setup_columns(event.target.dataset.name, event.target.checked);
        },
    }),

    _renderHeader: function (isGrouped) {
        var self = this;
        var $th = $(''+
        '<th>' +
            '<div class="btn-group hidden-xs o_dropdown">'+
                '<i class="o_optional_columns_dropdown_toggle fa fa-ellipsis-v dropdown-toggle" data-toggle="dropdown" aria-expanded="false" style="cursor: pointer;padding: 0 5px;text-align: center;line-height: 30px;z-index: 1;"/>'+
                '<ul id="show-menu" class="dropdown-menu o_group_by_menu oe_dropdown_menu" role="menu" style="max-height:250px; overflow:auto;right: -150px !important;">'+
                '</ul>'+
            '</div>'+
        '</th>'
        );
        var $tr = $('<tr>')
                .append(_.map(this.columns, this._renderHeaderCell.bind(this)));
        if (this.hasSelectors) {
            $tr.prepend(this._renderSelector('th'));
        }
        if (isGrouped) {
            $tr.prepend($('<th>').html('&nbsp;'));
        }
        this.contents = $th.find('ul#show-menu');
        console.log(this.contents);
        var columns = []
        _.each(this.arch.children, function(node) {
            if(typeof node.attrs !== 'undefined'){
                var name = node.attrs.name;
                var fields_name_name = typeof self.state.fields[name] !== 'undefined' ? self.state.fields[name].string:'';
                var description = node.attrs.string || fields_name_name;
                columns.push({
                    'field_name': node.attrs.name,
                    'label': description,
                    'invisible': node.attrs.modifiers.column_invisible || false
                });
            };
        })
        if ($th) {
            this.contents.append($(QWeb.render('ColumnSelectionDropDown', {
                widget: this,
                columns: columns
            })));
        }
        $tr.append($th);
        return $('<thead>').append($tr);
    },
    setup_columns: function(name, checked) {
        var self = this;
        $("#show-menu").hide();
            var field = false;
            _.each(this.arch.children, function(node) {
                if (node.attrs.name === name){
                   field = node;
                   return true;
                };

            });
            if (field != false){
                if (checked === false) {
                    field.attrs.modifiers.column_invisible = true;
                } else {
                    field.attrs.modifiers.column_invisible = false;
                };
            }
            this.updateState(this.state, {
                reload: true
            })
    },

});

$(document).click(function() {
    $('.oe_select_columns').click(function() {
        $("#show-menu").show();
    });
    $("#show-menu").hide();
});

});