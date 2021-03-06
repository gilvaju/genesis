<!--suppress RequiredAttributes -->
<template>
  <div class="app-crud-grid" :class="classNames">

    <slot name="header"/>

    <slot v-if="top" name="top">
      <app-grid-toolbar
              v-bind="{handler, direction, page, pages, limit, total, paginate, buttons: buttons.top,
                toolbar: $g.get(toolbar, 'pagination.top')}"
              @change-page="changePage" @change-limit="changeLimit"
              :class='$g.get(toolbar, "pagination.top.className")'/>
    </slot>
    <hr v-if="top">

    <slot name="content">
      <component :is="content" ref="grid"
                      v-bind="{columns, data, debug, position, slots, styles, bodyStyle, actions: buttons.middle}"/>
    </slot>

    <hr v-if="bottom">

    <slot v-if="bottom" name="bottom">
      <app-grid-toolbar
              v-bind="{handler, direction, page, pages, limit, total, paginate, buttons: buttons.bottom,
              toolbar: $g.get(toolbar, 'toolbar.pagination.bottom')}"
              @change-page="changePage" @change-limit="changeLimit"
              :class='$g.get(toolbar, "pagination.bottom.className")'/>
    </slot>

    <slot name="footer"/>

    <slot v-if="floating" name="floating">
      <app-button-bar v-bind="{floating: true, handler, buttons: buttons.floating}"/>
    </slot>

    <slot v-if="filtering" name="filter"></slot>
    <q-modal ref="filter" position="right" :content-css="filter.css">
      <app-grid-filter v-if="search" :filters="filter.columns" :record="filter.record"
                       @close="filterClose" @apply="filterApply" @clear="filterClear"/>
    </q-modal>

    <template v-if="debugging">
      <app-debugger v-bind="{label: 'data', inspect: data}"/>
      <app-debugger v-bind="{label: 'columns', inspect: columns}"/>
      <app-debugger v-bind="{label: 'filter', inspect: filter.record}"/>
    </template>
  </div>
</template>

<script type="text/javascript">
  import AppDataTable from 'genesis/components/data-table/AppDataTable.vue'
  import AppButtonBar from 'genesis/components/button/AppButtonBar.vue'
  import AppGridFilter from 'genesis/components/crud/components/grid/AppGridFilter'
  import AppGridToolbar from 'genesis/components/crud/components/grid/AppGridToolbar.vue'
  import MixinNavigation from 'genesis/components/@mixins/MixinNavigation'
  import { MixinComputed, MixinData, MixinMethods, MixinProps } from './model'
  import { MixinGrid, MixinFilter } from './model/grid'

  /**
   * @type {Object}
   * @property data
   * @property pages
   * @property total
   */
  const AppCrudGrid = {
    mixins: [
      MixinComputed, MixinData, MixinMethods, MixinProps, MixinNavigation, MixinFilter, MixinGrid
    ],
    name: 'app-crud-grid',
    components: {
      AppDataTable, AppButtonBar, AppGridToolbar, AppGridFilter
    }
  }
  export default AppCrudGrid
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .app-crud-grid
    padding 16px 0 0 0
    &.--grid-filtering
      .--button-filter
        background darkred !important
        i
          color white !important
    hr
      margin 10px 0
</style>
