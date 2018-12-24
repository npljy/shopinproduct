import React, {Component} from 'react';
import {Router, Route, IndexRedirect, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import store from '../store';
import CommodityManagement from './commodityManagement';

const App = (lt, cb) => {require.ensure([], require => {cb(null, require('../App').default);}, 'app');};
// const CommodityManagement = (lt, cb) => {require.ensure([], require => {cb(null, require('./commodityManagement/').default);}, 'commodityManagement');};
const Processing = (lt, cb) => {require.ensure([], require => {cb(null, require('./commodityManagement/processing').default);}, 'processing');};
const Category = (lt, cb) => {require.ensure([], require => {cb(null, require('./category').default);}, 'Category');};
const ProductEdit = (lt, cb) => {require.ensure([], require => {cb(null, require('./commodityManagement/productedit').default);}, 'ProductEdit');};
const Move = (lt, cb) => {require.ensure([], require => {cb(null, require('./move').default);}, 'Move');};

class CRouter extends Component {

    render() {
        return (
                <Router history={browserHistory}>
                    <Route path={'/'}>
                        <IndexRedirect to="/app/CommodityManagement" />
                        <Route path={'app'} getComponent={App}>
                            <Route path={'CommodityManagement'} component={CommodityManagement} />
                            <Route path="category" getComponent={Category} />
                            <Route path="move" getComponent={Move} />
                            <Route path="productedit/:id" getComponent={ProductEdit} />
                        </Route>
                    </Route>
                </Router>
        )
    }
}

export default CRouter;