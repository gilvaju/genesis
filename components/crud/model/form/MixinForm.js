import { Data } from 'genesis'
import { mapActions } from 'vuex'
import { toast, undo } from 'genesis/support/message/index'
import { wildcard } from 'genesis/support/utils/index'

export default {
  props: {
    scope: {
      default: () => 'view'
    },
    messages: {
      type: Object,
      default: () => ({
        create: 'Registro criado com sucesso',
        read: '',
        update: 'Registro atualizado com sucesso',
        delete: 'Registro apagado com sucesso'
      })
    },
    handlers: {
      type: Object,
      default () {
        return {
          create: (response) => {
            toast(wildcard(this.messages.create, this.$http.$body(response)))
            this.setAppModified(false)
          },
          read: (response) => {
            const populateForm = Data.get('form')
            populateForm(this, response)
          },
          update: (response) => {
            toast(wildcard(this.messages.update, this.$http.$body(response)))
            this.setAppModified(false)
          },
          delete: (response) => {
            undo(wildcard(this.messages.delete, this.$http.$body(response)), () => {
              // window.alert('Undo')
            })
            this.browse(this.path)
          }
        }
      }
    },
    tabs: {
      type: Array,
      default: () => ([])
    },
    tab: {
      type: String,
      default: () => ''
    }
  },
  data: () => ({
    fields: {},
    data: {},
    status: false
  }),
  methods: {
    /**
     */
    renderElements () {
      const map = item => {
        const readonly = this.scopes[this.scope] && this.scopes[this.scope].readonly
        return Object.assign({}, item.form, {
          disabled: readonly ? true : item.form.disabled,
          field: item.form.field,
          component: item.form.component ? (this.component + '-' + item.form.component) : ''
        })
      }
      const filter = item => item.scopes.includes(this.scope)

      this.fields = this.schemas.filter(filter).map(map)
    },
    input (data) {
      this.data = data
      this.setAppModified(true)
    },
    /**
     * @param {boolean} valid
     */
    valid (valid) {
      this.status = valid
    },
    /**
     * @param {AxiosError} error
     * @param {string} method
     * @param {Array} parameters
     */
    catch (error, method, parameters) {
      console.log('~>', this.$options.name, error)
    },
    /**
     * @param {string} id
     */
    fetchData (id) {
      window.setTimeout(() => this.read(id), this.timeout)
    },
    ...mapActions(['setAppModified'])
  },
  watch: {
    status () {
      this.renderActions()
    },
    data () {
      this.renderActions()
    }
  },
  created () {
    this.renderAll()
  },
  mounted () {
    if (this.id && this.$route.params[this.id]) {
      const fetch = () => this.fetchData(this.$route.params[this.id])
      window.setTimeout(fetch, 100)
    }
  }
}