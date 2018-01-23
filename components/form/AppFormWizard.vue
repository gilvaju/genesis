<template>
  <div class="app-form-wizard">
    <q-stepper v-model="currentStep" ref="stepper">
      <q-step v-for="(step, index) in steps" :name="step.name" :order="index"
              :key="step.name" :title="step.title" :subtitle="step.subtitle" :icon="step.icon">
        <div class="form">
          <component v-for="schema in componentsForWizard[step.name]" :key="schema.field" :is="schema.component"
                     v-bind="schema" v-model="record[schema.field]"
                     @input="formInput(schema.field, arguments)" @event="formEvent"></component>
        </div>
        <q-stepper-navigation v-if="$g.get(step, 'navigation.show')">
          <q-btn v-bind="$g.get(step, 'navigation.props')"
                 :disable="$g.get(step, 'navigation.back') === ''"
                 @click="currentStep = $g.get(step, 'navigation.back')">Voltar</q-btn>
          <q-btn v-bind="$g.get(step, 'navigation.props')"
                 :disable="$g.get(step, 'navigation.next') === ''"
                 @click="currentStep = step.navigation.next">Avançar</q-btn>
        </q-stepper-navigation>
      </q-step>
      <!--<q-stepper-navigation>
        <q-btn flat @click="$refs.stepper.previous()">Back</q-btn>
        <q-btn @click="$refs.stepper.next()">Next</q-btn>
      </q-stepper-navigation>-->
    </q-stepper>
  </div>
</template>

<script type="text/javascript">
  import appForm from './AppForm'

  export default {
    name: 'app-form-wizard',
    extends: appForm,
    methods: {
      nextStep () {
        this.$refs.stepper.next()
      },
      previousStep () {
        this.$refs.stepper.previous()
      }
    },
    created () {
      this.currentStep = this.step
      if (!this.currentStep) {
        this.currentStep = (Array.isArray(this.steps) && this.step[0]) ? this.step[0].name : ''
      }
      if (this.$route.query.step) {
        this.currentStep = this.$route.query.step
      }
    },
    methods: {
      arrayToObject (accumulate, item) {
        accumulate[item.field] = item
        return accumulate
      },
      updateComponents () {
        const components = {}
        if (this.steps.length) {
          this.steps.forEach(step => {
            components[step.name] = this.fields.filter(field => field.step === step.name).reduce(this.arrayToObject, {})
          })
        }
        this.components = components
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .q-stepper
      box-shadow none
      .q-stepper-header
        box-shadow none
      .q-stepper-step
        .q-stepper-step-content
          .q-stepper-step-inner
            padding 10px 3px !important
</style>
