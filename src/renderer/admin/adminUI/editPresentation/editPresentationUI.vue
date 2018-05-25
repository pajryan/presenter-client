<template>
    <div>
      
      <div id="presentationEditor"></div>
      <div id="presentationEditorControls">
        <button type="button" class="btn btn-primary" @click="savePresentation">save</button> <!-- :disabled="updateButtonDisabled" -->
        <button type="button" class="btn btn-primary" @click="discardChanges">cancel</button> <!-- :disabled="updateButtonDisabled" -->
      </div>
    </div>
</template>



<script>
  import Vue from 'vue'

  require('@json-editor/json-editor') //impacts window object directly (not ideal..), so don't load as module

  //load the json schema for the presentation, along with the current flow
  const schema = require ('./presentationSchema.json');
  console.error("currently loading default presentation flow!  WIll need to get this from the user values")
  const presentationFlow = require('./../defaultPresentationFlow.json')

  export default {
    data () {
      return {
        msg: 'edit presentation UI'
      }
    },
    mounted () {
      //load the json schema
      let editorElem = document.getElementById("presentationEditor");
      let editorOpts = {
        schema: schema,
        startval: presentationFlow,
        theme: 'bootstrap2',
        disable_edit_json: true,
        disable_properties: true,
        disable_collapse: true
      }
      var editor = new JSONEditor(editorElem, editorOpts);

      editor.on('ready',function() {
        // Now the api methods will be available
        let validationErrors = editor.validate();
        if(validationErrors.length > 0){
          console.error("error validating presentation flow against schmea", validationErrors);
          console.error("the schema is", schema);
        }
      });
    },
    methods:{
      savePresentation(){
        console.log('saving presentation')
      },
      discardChanges(){
        console.log('discarding changes')
      }
    }
  }


  
</script>

<style  lang="less">
  #presentationEditorControls{
    background: #fff;
    position: fixed;
    right: 30px;
    top: 120px;
    padding:9px 12px;
    box-shadow: 3px 3px 6px 2px #ccc;
    border: 1 px solid #ccc;
  }



  @textColor:#666;
  @borderColor:#dee2e6;

  #presentationEditor{
    margin-top: -27px;
  }

  #presentationEditor h3{
    font-size: 1.1em;
    margin-top: 15px;
  }

  #presentationEditor h3 span{
    padding-right:15px
  }

  #presentationEditor .card{
    border: 0px;
  }

  #presentationEditor .row{
    float:left;
    margin-right: 20px;
  }
  #presentationEditor .form-control-label{
    color: @textColor;
  }
  #presentationEditor .form-group input{
    width:130px;
  }
  #presentationEditor .form-text{
    color: @textColor;
    font-size: 0.9em;
  }

  #presentationEditor .nav{
    height: 23px;
  }
  #presentationEditor .nav li{
    border-top: 1px solid @borderColor;
    border-left: 1px solid @borderColor;
    border-right: 1px solid @borderColor;
  }
  #presentationEditor .nav li a{
    padding: 2px 6px;
    background: @borderColor;
    color: @textColor;
  }
  #presentationEditor .nav li a:hover{
    text-decoration:none;
  }
  #presentationEditor .nav li.active a{
    border-bottom:1px solid #fff;
    background: #fff;
    color: #000;
  }

  #presentationEditor .col-md-10{
    margin-left:110px;
  }
  
  #presentationEditor div[data-schemapath*="root.metadata"] .control-label{
    margin-top: 15px;
  }
  #presentationEditor div[data-schemapath*=".thumbnail"] .control-label{
    margin-top: 15px;
  }

  #presentationEditor div[data-schemapath*=".pages."]{
    padding-bottom:12px;
    margin-bottom:22px;
  }

  #presentationEditor div[data-schemapath*=".pages"]{
    margin-left:12px;
  }

  #presentationEditor div[data-schemapath*=".pages"] ul.nav{
    margin-left:12px;
  }


  #presentationEditor .btn{
    border-radius: 0.25rem;
    margin-right: 3px;
    width: 24px;
    height: 24px;
    padding: 0px;
    background: #ccc;
    color: @textColor
  }

  #presentationEditor .btn:hover{
    background: #bddce8;
  }

  #presentationEditor button.json-editor-btn-add:nth-of-type(1){
    // background: pink;
  }

  

  // hack to change all the buttons to "icons"
  #presentationEditor .json-editor-btn-add{
    text-indent: -9999px;
    line-height:0;
  }
  #presentationEditor .json-editor-btn-add:after{
    content: "+";
    text-indent: 0;
    display: block;
    line-height: initial;
  }

  #presentationEditor .json-editor-btn-delete{
    text-indent: -9999px;
    line-height:0;
  }
  #presentationEditor .json-editor-btn-delete:after{
    content: "×";
    text-indent: 0;
    display: block;
    line-height: initial;
  }

  #presentationEditor .json-editor-btn-movedown{
    text-indent: -9999px;
    line-height:0;
  }
  #presentationEditor .json-editor-btn-movedown:after{
    content: "↓";
    text-indent: 0;
    display: block;
    line-height: initial;
  }

  #presentationEditor .json-editor-btn-moveup{
    text-indent: -9999px;
    line-height:0;
  }
  #presentationEditor .json-editor-btn-moveup:after{
    content: "↑";
    text-indent: 0;
    display: block;
    line-height: initial;
  }


  //this gets rid of the "delete all" buttons (3rd button in the group, with the class json-editor-btn-delete)
  #presentationEditor .btn-group button:nth-of-type(3).json-editor-btn-delete{
    background: pink;
    display:none;
  }
   //this gets rid of the "delete" buttons (2rd button in the group, with the class json-editor-btn-delete, after the add button)
   //  this button is confusing becuase it deletes the "child" from the parent level. (when you can just delete the child directly)
  #presentationEditor .btn-group button.json-editor-btn-add + button:nth-of-type(2){
    background: pink;
    display:none;
  }

  //This targets the add ssection button at the very top
  #presentationEditor h3>div>button.json-editor-btn-add:nth-of-type(1){
    margin-left:-66px;
    margin-top: 14px;
    position: absolute;;
  }

  //This targets the add buttons for adding items to pages
  #presentationEditor div[data-schemapath*=".pageItems"]>div>div>button.json-editor-btn-add:nth-of-type(1){
    margin-top: -20px; 
    width:40px !important;
    margin-left:15px !important;
  }
  
  #presentationEditor div[data-schemapath*=".pages"]>div>div>button.json-editor-btn-add:nth-of-type(1){
    width:80px;
    margin-left:0%;
  }




  #presentationEditor tbody td:nth-of-type(1) input{
    width: 50px !important;
  }
  #presentationEditor tbody td:nth-of-type(2) select{
    width: 140px !important;
  }
  #presentationEditor tbody td:nth-of-type(3) input{
    width: 200px !important;
  }
  #presentationEditor tbody td:nth-of-type(4) input{
    width: 200px !important;
  }

</style>