<template>
    <div>
      <div id="presentationEditor"></div>
        {{ msg }}&darr;<br />&#10005;<br />&plus;<br />&times;
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
      console.log("schema", schema)
      let editorElem = document.getElementById("presentationEditor");
      let editorOpts = {
        schema: schema,
        startval: presentationFlow,
        theme: 'bootstrap2',
        // iconlib: "bootstrap2",
        disable_edit_json: true,
        disable_properties: true,
        disable_collapse: true
      }
      var editor = new JSONEditor(editorElem, editorOpts);

      editor.on('ready',function() {
        // Now the api methods will be available
        let validateResult = editor.validate();
        console.log("validation result", validateResult);

        // document.getElementsByClassName('json-editor-btn-add')

      });
    }
  }


  
</script>

<style  lang="less">
  @textColor:#666;
  @borderColor:#999;

  #presentationEditor h3{
    font-size: 1.1em;
    margin-top: 15px;
  }

  #presentationEditor h3 span{
    padding-right:15px
  }

  #presentationEditor span{
 
    
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


  #presentationEditor .tabs{
    float:left;
    font-size: 1.1em;
    width:110px;
  }
  #presentationEditor .tabs a{
    border-bottom: 1px solid @borderColor;
    padding: 0px 4px;
  }
  #presentationEditor .tabs .active{
    background: #bddce8;
  }
  #presentationEditor .col-md-10{
    margin-left:110px;
  }
  #presentationEditor .col-md-10 .card{
    
  }

  #presentationEditor .btn-group{
    // margin-left:0px !important;
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