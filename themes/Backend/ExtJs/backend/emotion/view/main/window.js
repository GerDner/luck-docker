/**
 * Shopware 5
 * Copyright (c) shopware AG
 *
 * According to our dual licensing model, this program can be used either
 * under the terms of the GNU Affero General Public License, version 3,
 * or under a proprietary license.
 *
 * The texts of the GNU Affero General Public License with an additional
 * permission and of our proprietary license can be found at and
 * in the LICENSE file you have received along with this program.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * "Shopware" is a registered trademark of shopware AG.
 * The licensing of the program under the AGPLv3 does not imply a
 * trademark license. Therefore any rights, title and interest in
 * our trademarks remain entirely with us.
 *
 * @category   Shopware
 * @package    UserManager
 * @subpackage View
 * @version    $Id$
 * @author shopware AG
 */

//{namespace name=backend/emotion/view/main}

/**
 * Shopware UI - Media Manager Main Window
 *
 * This file contains the business logic for the User Manager module. The module
 * handles the whole administration of the backend users.
 */
//{block name="backend/emotion/view/main/window"}
Ext.define('Shopware.apps.Emotion.view.main.Window', {
	extend: 'Enlight.app.Window',
    title: '{s name=window/title}Emotion{/s}',
    alias: 'widget.emotion-main-window',
    border: false,
    autoShow: true,
    layout: 'border',
    height: '90%',
    width: 990,
    stateful: true,
    stateId: 'emotion-main-window',

    /**
     * Object which are used in this component
     * @Object
     */
    snippets: {
        tab: {
            overview: '{s name=window/tab/overview}Overview{/s}',
            custom_grids: '{s name=window/tab/custom_grids}Grids management{/s}',
            custom_templates: '{s name=window/tab/custom_templates}Templates management{/s}',
            expert_settings: '{s name=window/tab/expert_settings}Expert settings{/s}'
        },
        tree: {
            title: '{s name=list/tree/title}Categories{/s}'
        },
        filter: {
            title: '{s name=list/filter/title}Filter{/s}',
            noFilter: '{s name=list/no_filter}No filter{/s}',
            onlyDesktop: '<div class="sprite-imac" style="width: 16px; height: 16px; display: inline-block; margin-right:5px">&nbsp;</div> {s name=list/only_desktop}Only desktop devices{/s}',
            onlyTabletLandscape: '<div class="sprite-ipad--landscape" style="width: 16px; height: 16px; display: inline-block; margin-right:5px">&nbsp;</div> {s name=list/only_tablet_landscape}Only tablet landscape devices{/s}',
            onlyTabletPortrait: '<div class="sprite-ipad--portrait" style="width: 16px; height: 16px; display: inline-block; margin-right:5px">&nbsp;</div> {s name=list/only_tablet}Only tablet devices{/s}',
            onlyMobileLandscape: '<div class="sprite-iphone--landscape" style="width: 16px; height: 16px; display: inline-block; margin-right:5px">&nbsp;</div> {s name=list/only_mobile_landscape}Only mobile landscape devices{/s}',
            onlyMobilePortrait: '<div class="sprite-iphone--portrait" style="width: 16px; height: 16px; display: inline-block; margin-right:5px">&nbsp;</div> {s name=list/only_mobile}Only mobile devices{/s}',
            onlyActive: '<div class="sprite-ui-check-box" style="width: 16px; height: 16px; display: inline-block; margin-right:5px">&nbsp;</div> {s name=list/only_active}Only active worlds{/s}',
            onlyLandingpage: '{s name=list/only_landingpage}Only landingpages{/s}',
            onlyWorld: '{s name=list/only_world}Only shopping worlds{/s}'
        }
    },

    /**
     * Initializes the component and builds up the main interface
     *
     * @return void
     */
    initComponent: function() {
        var me = this;

        me.categoryStore = Ext.create('Shopware.store.CategoryTree');

        me.items = [
            me.createTabPanel(),
            me.createSidebarPanel()
        ],

        me.callParent(arguments);
    },

    /**
     * Creates the sidebar panel which shows the categories and filter elements
     * of the emotion module.
     *
     * @returns { Ext.panel.Panel } the sidebar panel which contains the categories and filters
     */
    createSidebarPanel: function() {
        var me = this;

        me.sidebarPanel = Ext.create('Ext.panel.Panel', {
            title: '{s name=sidebar/title}Kategorien{/s}',
            collapsible: true,
            width: 230,
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            region: 'west',
            items: [
                me.createTree(),
                me.createFilterPanel()
            ]
        });

        return me.sidebarPanel;
    },

    createFilterPanel: function() {
        var me = this;

        return Ext.create('Ext.form.Panel', {
            title: me.snippets.filter.title,
            bodyPadding: 5,
            items: [{
                xtype: 'radiogroup',
                listeners: {
                    change: {
                        fn: function(view, newValue, oldValue) {
                            var me = this,
                                store = me.gridPanel.getStore();

                            store.getProxy().extraParams.filterBy = newValue.filter;
                            store.load();
                        },
                        scope: me
                    }
                },
                columns: 1,
                vertical: true,
                items: me.createFilterData()
            }]
        });
    },

    /**
     * Creates the filter options
     * for the emotion sidebar
     */
    createFilterData: function() {
        var me = this;

        return [{
            boxLabel: me.snippets.filter.noFilter,
            name: 'filter',
            inputValue: 'none',
            checked: true
        },
        {
            boxLabel: me.snippets.filter.onlyDesktop,
            name: 'filter',
            inputValue: 'onlyDesktop'
        },
        {
            boxLabel: me.snippets.filter.onlyTabletLandscape,
            name: 'filter',
            inputValue: 'onlyTabletLandscape'
        },
        {
            boxLabel: me.snippets.filter.onlyTabletPortrait,
            name: 'filter',
            inputValue: 'onlyTablet'
        },
        {
            boxLabel: me.snippets.filter.onlyMobileLandscape,
            name: 'filter',
            inputValue: 'onlyMobileLandscape'
        },
        {
            boxLabel: me.snippets.filter.onlyMobilePortrait,
            name: 'filter',
            inputValue: 'onlyMobile'
        },
        {
            boxLabel: me.snippets.filter.onlyActive,
            name: 'filter',
            inputValue: 'active'
        },
        {
            boxLabel: me.snippets.filter.onlyLandingpage,
            name: 'filter',
            inputValue: 'onlyLandingpage'
        },
        {
            boxLabel: me.snippets.filter.onlyWorld,
            name: 'filter',
            inputValue: 'onlyWorld'
        }]
    },

    /**
     * Creates the category tree
     *
     * @return [Ext.tree.Panel]
     */
    createTree: function() {
        var me = this;

        var tree = Ext.create('Ext.tree.Panel', {
            rootVisible: true,
            flex: 1,
            expanded: true,
            useArrows: false,
            store: me.categoryStore,
            root: {
                text: me.snippets.tree.title,
                expanded: true
            },
            listeners: {
                itemclick: {
                    fn: function(view, record) {
                        var me    = this,
                            store = me.gridPanel.getStore();

                        if (record.get('id') === 'root') {
                            store.getProxy().extraParams.categoryId = null;
                        } else {
                            store.getProxy().extraParams.categoryId = record.get('id');
                        }

                        //scroll the store to first page
                        store.currentPage = 1;
                        store.load({
                            callback: function() {
                            }
                        });
                    },
                    scope: me
                }
            }
        });

        return tree;
    },




    /**
     * Creates the tab panel which holds off the different
     * areas of the emotion module.
     *
     * @returns { Ext.tab.Panel } the tab panel which contains the different areas
     */
    createTabPanel: function() {
        var me = this;

        me.tabPanel = Ext.create('Ext.tab.Panel', {
            width: 760,
            region: 'center',
            items: [ me.createOverviewTab(), me.createExpertSettingsTab() ]
        });

        return me.tabPanel;
    },

    /**
     * Creates a container which holds off the upper toolbar and the
     * actual grid panel.
     *
     * The container will be used as the `overview` tab.
     *
     * @returns { Ext.container.Container }
     */
    createOverviewTab: function() {
        var me = this;

        me.gridPanel = Ext.create('Shopware.apps.Emotion.view.list.Grid', {
            region: 'center'
        });

        me.overviewContainer = Ext.create('Ext.container.Container', {
            layout: 'border',
            title: me.snippets.tab.overview,
            items: [{
                xtype: 'emotion-list-toolbar',
                region: 'north'
            }, me.gridPanel ]
        });

        return me.overviewContainer;
    },

    /**
     * Creates the container which represents the expert settings tab.
     *
     * The tab contains the custom grids and custom templates tabs.
     *
     * @returns { Ext.tab.Panel }
     */
    createExpertSettingsTab: function() {
        var me = this;

        me.expertSettingsTabPanel = Ext.create('Ext.tab.Panel', {
            title: me.snippets.tab.expert_settings,
            items: [ me.createCustomGridsTab(), me.createCustomTemplatesTab() ]
        });

        return me.expertSettingsTabPanel;
    },

    /**
     * Creates the container which represents the custom grids tab.
     *
     * @returns { Ext.container.Container }
     */
    createCustomGridsTab: function() {
        var me = this;

        me.customGridsContainer = Ext.create('Ext.container.Container', {
            layout: 'border',
            title: me.snippets.tab.custom_grids,
            items: [{
                xtype: 'emotion-grids-toolbar',
                region: 'north'
            }, {
                xtype: 'emotion-grids-list',
                region: 'center',
                store: Ext.create('Shopware.apps.Emotion.store.Grids').load()
            }]
        });

        return me.customGridsContainer;
    },

    /**
     * Creates the container which represents the custom templates tab.
     *
     * @returns { Ext.container.Container }
     */
    createCustomTemplatesTab: function() {
        var me = this;

        me.customTemplatesTab = Ext.create('Ext.container.Container', {
            layout: 'border',
            title: me.snippets.tab.custom_templates,
            items: [{
                xtype: 'emotion-templates-toolbar',
                region: 'north'
            }, {
                xtype: 'emotion-templates-list',
                region: 'center'
            }]
        });

        return me.customTemplatesTab;
    }
});
//{/block}
