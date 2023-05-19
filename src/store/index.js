import Vue from 'vue';
import Vuex from 'vuex';
import config from '@/config'
import util from '@/util';
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        token: util.storage.get("token"),
        auth: util.storage.get("auth"),
        uid: util.storage.get("uid"),
        loginUserName: "",
        loginUserpwd: "",
        trainInfo: [], //训练传参
        paramGroup: '', //班组传参
        pickDate: '',
    },
    getters: {
        UserName(state) {
            if (!state.loginUserName) {
                state.loginUserName = util.storage.get(config.KEY.CACHE_LOGIN_USER_NAME)
            }
            return state.loginUserName
        },
        getparamGroup(state) {
            if (!state.paramGroup) {
                state.paramGroup = util.storage.get('paramGroup')

            }
            return state.paramGroup
        },
        getpickDate(state) {
            if (!state.pickDate) {
                state.pickDate = util.storage.get('pickDate')

            }
            return state.pickDate
        },
        gettrainInfo(state) {
            if (!state.trainInfo) {
                state.trainInfo = util.storage.get('trainInfo')

            }
            return state.trainInfo
        }
    },
    mutations: {
        setLoginToken(state, val) {
            state.token = val
        },
        removeLoginToken(state) {
            state.token = ""
        },
        setAuthority(state, val) {
            state.auth = val
        },
        removeAuthority(state, val) {
            state.auth = ""
        },
        setUid(state, val) {
            state.uid = val
        },
        removeUid(state) {
            state.uid = ""
        },

        setLoginUserName(state, val) {
            state.loginUserName = val
            util.storage.set(config.KEY.CACHE_LOGIN_USER_NAME, val)
        },
        setLoginUserpwd(state, val) {
            state.loginUserpwd = val
            util.storage.set(config.KEY.CACHE_LOGIN_PASS_PWD, val)
        },
        removeLoginUserName(state) {
            state.loginUserName = ""
            util.storage.remove(config.KEY.CACHE_LOGIN_USER_NAME)
        },
        removeLoginUserpwd(state) {
            state.loginUserpwd = ""
            util.storage.remove(config.KEY.CACHE_LOGIN_PASS_PWD)
        },
        setParamGroup(state, paramGroup) {
            state.paramGroup = paramGroup;
            util.storage.set('paramGroup', paramGroup);
        },
        setPickDate(state, pickDate) {
            state.pickDate = pickDate;
            util.storage.set('pickDate', pickDate);
        },
        setTrainInfo(state, trainInfo) {
            state.trainInfo = trainInfo;
            util.storage.set('trainInfo', trainInfo);
        }

    },
    actions: {

    }
});

export default store;