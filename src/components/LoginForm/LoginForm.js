import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';
import { mapState } from 'vuex';

import { auth } from '@/services/firebase';
import { LOGGED_IN_ROUTE } from '@/constants';

export default {
  /**
   * -------------------------------------------------------------------
   *  Mixins
   * -------------------------------------------------------------------
   */
  mixins: [validationMixin],

  /**
   * -------------------------------------------------------------------
   *  Data
   * -------------------------------------------------------------------
   */
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },

  /**
   * -------------------------------------------------------------------
   *  Methods
   * -------------------------------------------------------------------
   */
  methods: {
    /**
     * loginWithEmail
     * @description log user in by dispatching login action
     */
    async loginWithEmail() {
      this.$v.$touch();

      // If form is valid ..
      if (!this.$v.$invalid) {
        this.error = '';

        // Success ..
        try {
          await auth.signInWithEmailAndPassword(this.email, this.password);

          // Failed ..
        } catch (error) {
          console.log(error);
          this.error = error.message;
        }
      }
    }
  },

  /**
   * -------------------------------------------------------------------
   *  Watch
   * -------------------------------------------------------------------
   */
  watch: {
    /**
     * user
     * @description watch user property to handle redirect on auth change if firebase is slow
     */
    user() {
      this.$router.push({
        name: LOGGED_IN_ROUTE
      });
    }
  },

  /**
   * -------------------------------------------------------------------
   *  Computed
   * -------------------------------------------------------------------
   */
  computed: {
    ...mapState({
      user: (state) => state.user.data
    }),
    emailRules() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.required && errors.push('Email address is required');
      !this.$v.email.email && errors.push('Email must be valid');
      return errors;
    },
    passwordRules() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push('Password is required');
      return errors;
    }
  },

  /**
   * -------------------------------------------------------------------
   *  Validations
   * -------------------------------------------------------------------
   */
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    }
  }
};
