import Wildcard from '../wildcard';
import update from 'react/lib/update';

let DefaultState = {
    allData: [
        {
            content: {},//列表数据
            filterData: {},//筛选条件
            pageIndex:1,
            pageSize:20
        },
        {
            content: {},//列表数据
            filterData: {},//筛选条件
            pageIndex:1,
            pageSize:20
        },
        {
            content: {},//列表数据
            filterData: {},//筛选条件
            pageIndex:1,
            pageSize:20
        },
        {
            content: {},//列表数据
            filterData: {},//筛选条件
            pageIndex:1,
            pageSize:20
        }
    ],
    currentIndex: 0,
    memory: null,//离开列表页时的index
}

function Processing (state=DefaultState, action) {
    const { type, data } = action;
    // debugger
    switch ( type ) {
    case Wildcard.ALL_THE_DATA://all 列表数据
        return update(state,{$merge: {allData: data}});

    case Wildcard.CURRENT_INDEX://tab id值
        return update(state, {$merge: {currentIndex: data}});
    case Wildcard.LEAVE_INDEX://离开页面时index值
        return update(state, {$merge: {memory: data}});

    default:
        return state; 
    }
    
    
    
}
export {Processing};
