<template>
    <div>
      select a presentation to edit: 
      <select v-model="selectedPresentationId" @change="presentationSelected" class="form-control">
        <option style="background: red" v-for="presentation in presentations" :key="presentation.metadata.id" :value="presentation.metadata.id" :class="selectedPresentationIsActive?'table-success':''">{{presentation.metadata.title}} (v{{presentation.metadata.version}}) {{presentation.metadata.id===currentActivePresentationId?' -ACTIVE-':''}}</option>
      </select>
      <div>
        <ul>
          <li v-for="error in validationErrors" :key="error.num">error</li>
        </ul>
      </div>
      <div id="presentationEditor"></div>
      <div id="presentationEditorControls" v-if="selectedPresentationId!=''">
        <button type="button" class="btn btn-primary" @click="savePresentation" v-if="!selectedPresentationIsActive">save changes</button>
        <button type="button" class="btn btn-primary" @click="savePresentation" v-if="selectedPresentationIsActive">save changes and make active</button>
        <button type="button" class="btn btn-primary" @click="discardChanges">discard changes</button>
      </div>
    </div>
</template>



<script>

  import Vue from 'vue'

  require('@json-editor/json-editor') //impacts window object directly (not ideal..), so don't load as module

  //load the json schema for the presentation, along with the current flow
  const schema = require ('./presentationSchema.json');

  export default {
    props: ['adminObj'], 
    data () {
      return {
        presentations: [],
        selectedPresentationId: "",
        selectedPresentationObject: {},
        selectedPresentationIsActive: false,
        currentActivePresentationId: '',
        editor: null,
        validationErrors: []
      }
    },
    mounted () {
      //get the available presenations.  
      this.getPresentations();
    },
    methods:{
      getPresentations(){ // Note that this is ALSO called when the tabs are clicked on the admin interface - to make sure the presentation lists are in sync
        this.presentations = this.adminObj.getPresentations();
        this.currentActivePresentationId = this.adminObj.getActivePresentationId();
      },
      presentationSelected(){
        //kill any existing editor
        if(this.editor){this.editor.destroy();}
        this.selectedPresentationObject = {};
        //get the new object and load it up
        this.selectedPresentationObject = this.adminObj.getPresentationById(this.selectedPresentationId);
        //see if this presentation (which is being edited) is the active presentation
        this.selectedPresentationIsActive = this.currentActivePresentationId == this.selectedPresentationId;
        this.buildEditor(this.selectedPresentationObject);
      },
      buildEditor(presenationObj){
        //load the json schema and load the data file
        let editorElem = document.getElementById("presentationEditor");
        let editorOpts = {
          schema: schema,
          startval: presenationObj,
          theme: 'bootstrap2',
          disable_edit_json: true, disable_properties: true, disable_collapse: true
        }
        this.editor = new JSONEditor(editorElem, editorOpts);
        this.editor.on('ready',this.validateEditor);
      },
      validateEditor(){
        // Now the api methods will be available
        this.validationErrors = this.editor.validate();
        if(this.validationErrors.length > 0){
          console.error("error validating presentation flow against schmea", validationErrors);
          console.error("the schema is", schema);
        }
        return this.validationErrors.length == 0;
      },
      savePresentation(){
        /*
          With every save:
          - increment the version number 
            - version number will not be user editable
          - update the createdAt date (also not user editable)
          - create an entirely new file (new UUID)

          - this will mean that we never conflict - there is no editing an existing file, only creating a new one
          
          - then, can decide what to do with the "old" version
            - could delete it locally and remotely
            - could just keep everything and let the user deal with deleting
        */
        if(this.validateEditor){
          let newValue = this.editor.getValue();
          let newUUID = this.adminObj.getUUID();
          newValue.metadata.version += 1; // increment version #
          newValue.metadata.creationDate = new Date().getTime();  // update
          newValue.metadata.id = newUUID;                         // new UUID
          this.adminObj.writePresentation(newValue);

          //for now, I'm going to delete (archive) the local copy of the "old" presentation
          // however if the current is active, need to mark the new one as active
          if(this.selectedPresentationIsActive){
            //make the new presentation active
            this.adminObj.setActivePresentation(newUUID);
          }
          this.adminObj.deletePresentation(this.selectedPresentationId);

          // update things on this local page
          this.selectedPresentationObject = newValue;
          this.selectedPresentationId = newUUID,
          this.getPresentations();
          this.presentationSelected();

          
          

        }
        
      },
      discardChanges(){
        // just kill the existing editor and reload the latest presenation
        if(window.confirm('Clicking OK will discard any edits you may have made')){
          if(this.editor){this.editor.destroy();}
          this.buildEditor(this.selectedPresentationObject);
        }
      }
    }
  }


  
</script>

<style  lang="less">
  #presentationEditorControls{
    background: #fff;
    position: absolute;
    right: 30px;
    top: 180px;
    // box-shadow: 3px 3px 6px 2px #ccc;
    // border: 1 px solid #ccc;
  }


  @textColor:#666;
  @borderColor:#dee2e6;

  #presentationEditor{
    margin-top: 0px;
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