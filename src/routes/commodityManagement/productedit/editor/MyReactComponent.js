
/******************************
 * Created by lv on 2017/11/15.
 *
 * 自定义react组件
 ******************************/
import React from "react";
import PropTypes from 'prop-types';
import {Guid} from './utils';
import 'kindeditor/kindeditor-all-min.js';
import 'kindeditor/themes/default/default.css';

class KindEditorReactComponent extends React.Component{

    constructor(props){
        super(props)
        const value=this.props.contents||"";

        this.state = {
            id: Guid(),
            content:value
        };
    }
    componentDidMount(){
        this.initEditor();
        //this.setState({content: this.props.contents})
    }
    componentWillUnmount() {
        // 组件卸载后，清除放入库的id
        this.setState({content:'123456', id: ''})

    }
    componentWillReceiveProps(nextProps) {
        //console.log(nextProps)
        let {contents} = nextProps;
        let oldContent = this.editor.html();
        if (oldContent !== contents) {
            this.setState({content:contents});
            this.editor.html(contents);
        }
    }
    getItems() {
        let defaultItems = [
            'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
            'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
            'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
            'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
            'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', /*'multiimage',
             'flash', 'media', 'insertfile',*/ 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
            'anchor', 'link', 'unlink', '|', 'about'
        ]
        return this.props.items || defaultItems
    }
    getHtmlTags () {
        let defaultTags = {
            font: ['color', 'size', 'face', '.background-color'],
            span: ['style'],
            div: ['class', 'align', 'style'],
            table: ['class', 'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'style'],
            'td,th': ['class', 'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor', 'style'],
            a: ['class', 'href', 'target', 'name', 'style'],
            embed: ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality',
                'style', 'align', 'allowscriptaccess', '/'],
            img: ['src', 'width', 'height', 'border', 'alt', 'title', 'align', 'style', '/'],
            hr: ['class', '/'],
            br: ['/'],
            'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6': ['align', 'style'],
            'tbody,tr,strong,b,sub,sup,em,i,u,strike': []
        }
        return {...defaultTags, ...this.props.htmlTags}
    }

    initEditor() {
        let props = this.props;
        let that=this;
        this.editor = window.KindEditor.create(`#${this.state.id}`,  {
            width: '720',
            height: 600,
            minWidth: props.minWidth || 650,
            minHeight: props.minHeight || 100,
            items: this.getItems(),
            noDisableItems: props.noDisableItems || ['source', 'fullscreen'],
            filterMode: props.filterMode || true,
            htmlTags: this.getHtmlTags(),
            wellFormatMode: props.wellFormatMode || true,
            resizeType: props.resizeType || 2,
            themeType: props.themeType || 'default',
            langType: props.langType || 'zh-CN',
            designMode: props.designMode || true,
            fullscreenMode: props.fullscreenMode || false,
            basePath: props.basePath || '',
            themesPath: props.cssPath,
            pluginsPath: props.pluginsPath || '/static/kindeditor/plugins/',
            langPath: props.langPath || '',
            minChangeSize: props.minChangeSize || 5,
            loadStyleMode: props.loadStyleMode || true,
            urlType: props.urlType || '',
            newlineTag: props.newlineTag || 'p',
            pasteType: props.pasteType || 2,
            dialogAlignType: props.dialogAlignType || 'page',
            shadowMode: props.shadowMode || true,
            zIndex: props.zIndex || 811213,
            useContextmenu: props.useContextmenu || true,
            syncType: props.syncType || 'form',
            indentChar: props.indentChar || '\t',
            cssPath: props.cssPath,
            cssData: props.cssData,
            bodyClass: props.bodyClass || 'ke-content',
            colorTable: props.colorTable,
            afterCreate: props.afterCreate,
            afterChange: props.afterChange,
            afterTab: props.afterTab,
            afterFocus: props.afterBlur,
            afterBlur: function () {
                that.props.onChange(this.html());
            },
            afterUpload: function (a) {
                console.log(a);
            },
            uploadJson: props.uploadJson,
            fileManagerJson: props.fileManagerJson,
            allowPreviewEmoticons: props.allowPreviewEmoticons || true,
            allowImageUpload: props.allowImageUpload || true,
            allowFlashUpload: props.allowFlashUpload || false,
            allowMediaUpload: props.allowMediaUpload || true,
            allowFileUpload: props.allowFileUpload || false,
            allowFileManager: props.allowFileManager || false,
            fontSizeTable: props.fontSizeTable || ['9px', '10px', '12px', '14px', '16px', '18px', '24px', '32px'],
            imageTabIndex: props.imageTabIndex || 0,
            formatUploadUrl: props.formatUploadUrl || false,
            fullscreenShortcut: props.fullscreenShortcut || false,
            extraFileUploadParams: props.extraFileUploadParams || [],
            filePostName: props.filePostName || 'file',
            fillDescAfterUploadImage: props.fillDescAfterUploadImage || false,
            afterSelectFile: props.afterSelectFile,
            pagebreakHtml: props.pagebreakHtml || '<hr style=”page-break-after: always;” class=”ke-pagebreak” />',
            allowImageRemote: props.allowImageRemote || false,
            autoHeightMode: props.autoHeightMode || false,
            fixToolBar: props.fixToolBar || true,
            tabIndex: props.tabIndex
        })
        // this.editor.html('<img src="http://pic1.shangpin.com/e/s/00/00/00/20180813153324198035-0-0.jpg" width="720" height="991" title="gucci-包-409486_01.jpg" alt="gucci-包-409486_01.jpg" /><img src="http://pic1.shangpin.com/e/s/00/00/00/20180813153325245829-0-0.jpg" width="720" height="1343" title="gucci-包-409486_02.jpg" alt="gucci-包-409486_02.jpg" /><img src="http://pic1.shangpin.com/e/s/00/00/00/20180813153326292770-0-0.jpg" width="720" height="1239" title="gucci-包-409486_03.jpg" alt="gucci-包-409486_03.jpg" /><img src="http://pic1.shangpin.com/e/s/00/00/00/20180813153327760795-0-0.jpg" width="720" height="1021" title="gucci-包-409486_04.jpg" alt="gucci-包-409486_04.jpg" /><img src="http://pic1.shangpin.com/e/s/00/00/00/20180813153328823289-0-0.jpg" width="720" height="1315" title="gucci-包-409486_05.jpg" alt="gucci-包-409486_05.jpg" /><img src="http://pic1.shangpin.com/e/s/00/00/00/20180813153330292331-0-0.jpg" width="720" height="1250" title="gucci-包-409486_06.jpg" alt="gucci-包-409486_06.jpg" /><img src="http://pic1.shangpin.com/e/s/00/00/00/20180813153331432244-0-0.jpg" width="720" height="1536" title="gucci-包-409486_07.jpg" alt="gucci-包-409486_07.jpg" /><img src="http://pic1.shangpin.com/e/s/00/00/00/20180813153332354589-0-0.jpg" width="720" height="1104" title="gucci-包-409486_08.jpg" alt="gucci-包-409486_08.jpg" />');

    }

    render(){
        return (
            <div className="kindeditor">
        <textarea
            id={this.state.id}                                                                                                                                                                                                                                                                                                                                                                                                                                          
            name="content"
            ref="textarea"
            value={this.state.content}
        >
        </textarea>
            </div>
        )
    }


}

KindEditorReactComponent.propTypes = {
    contents:PropTypes.string,
    onChange:PropTypes.func
}

export default KindEditorReactComponent;
