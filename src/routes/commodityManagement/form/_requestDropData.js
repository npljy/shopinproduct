import ERPfetct from '../../../utils/Fetch/ERPFetch';
import store from '../../../store';
import wildcard from '../../../store/wildcard';
import ERPFetch from '../../../utils/Fetch/ERPFetch';

function _requestDropData (argu, index, value){
    return (dispatch, getState) => {
            if ( argu == 'root') {
                ERPFetch.fetchGet({}, '/api/shopCategory/shopCategoryListByCategoryNo/'+argu)
                .then((res)=>{
                    if ( res.code == 0 ) {
                        let DropData = store.getState().Processing.DropData;
                        DropData[index].data = res.content;
                         dispatch({
                            type: wildcard.PROCESSING_DROP_DATA,
                            data: DropData
                        })
                    }
                    
                })
            } else if ( index == 0 || index == 1){
                ERPFetch.fetchGet({}, '/api/shopCategory/shopCategoryListByCategoryNo/'+argu)
                .then((res)=>{
                    if ( res.code == 0 ) {
                        let DropData = store.getState().Processing.DropData;
                        DropData[index].data = res.content;
                         dispatch({
                            type: wildcard.PROCESSING_DROP_DATA,
                            data: res.content
                        })
                    }
                    
                })
            } else if ( index == 2 ) {

            }
    }

}

export {_requestDropData};