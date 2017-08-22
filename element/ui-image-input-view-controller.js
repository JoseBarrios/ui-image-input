const uiImageInputDocument = document._currentScript || document.currentScript;
const uiImageInputTemplate = uiImageInputDocument.ownerDocument.querySelector('#ui-image-input-view');

class UIImageInput extends HTMLElement{

	static get observedAttributes(){ return ['src']; }

  constructor(model){
    super();
		const view = document.importNode(uiImageInputTemplate.content, true);
		//LIGHT DOM
		this.appendChild(view);
		//SHADOW DOM
		//this.shadowRoot = this.attachShadow({mode: 'open'});
		//this.shadowRoot.appendChild(view);
		this.connected = false;
	}

 connectedCallback() {
	 //SHADOW ROOT
	 //this.$input = this.shadowRoot.querySelector('input');
	 this.connected = true;
	 this.$input = this.querySelector('#input');
	 this.$image = this.querySelector('#image');
	 this.$imageContainer = this.querySelector('.container');
	 this.$imageContainer.hidden = true;

	 this.$image.addEventListener('click', e => {
		 e.preventDefault();
		 showPicker();
	 });

	 this.$input.addEventListener('click', e => {
		 e.preventDefault();
		 showPicker();
	 });

	 var client = filestack.init('Ab0nGQDOrSROlWnmMldl4z');
	 const showPicker = () => {
		 let options = {};
		 options.fromSources = ["local_file_system", "url", "imagesearch"];
		 options.accept = "image/*";
		 options.minFiles = 1;
		 options.maxFiles = 1;
		 options.startUploadingWhenMaxFilesReached = true;
		 options.uploadInBackground = true;

		 client.pick(options).then((result) => {
			 this.src = result.filesUploaded[0].url
			 this._updateEvent();
			 this._updateRender();
		 });
	 }
 }

	attributeChangedCallback(attrName, oldVal, newVal) {
		switch(attrName){
			case 'src':
				break;
			default:
				console.warn(`Attribute '${attrName}' is not handled, change that.`)
		}
	}

	_updateEvent(){
		this.dispatchEvent(new CustomEvent('update', {detail: this.src, bubbles:false }));
	}

	_updateRender(){
		this.$imageContainer.hidden = false;
		this.$image.src = this.src;
	}

	//get shadowRoot(){return this._shadowRoot;}
	//set shadowRoot(value){ this._shadowRoot = value}

	get src(){return this._src;}
	set src(value){ this._src = value; }

	disconnectedCallback() {
		console.log('disconnected');
	}
}

window.customElements.define('ui-image-input', UIImageInput);
