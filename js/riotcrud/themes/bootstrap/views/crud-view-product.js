riot.tag2('crud-view-show-custom-product', '<div class="container"> <crud-top-bar></crud-top-bar> <form id="{VM.model}-show"> hallo <div class="row small-up-2 medium-up-3 large-up-4"> <div class="small-3 columns"> <label for="id" class="text-right middle">{field.label}</label> </div> <div class="small-9 columns"> <strong>ID</strong> <input type="text" name="id" value="{VM.row[\'id\']}"> </div> </div> <div class="row small-up-2 medium-up-3 large-up-4"> <div class="small-3 columns"> <label for="name" class="text-right middle">{field.label}</label> </div> <div class="small-9 columns"> <strong>ID</strong> <input type="text" name="name" value="{VM.row[\'name\']}"> </div> </div> <crud-field-switch></crud-field-switch> </form> </div> <crud-modal-destroy data="{VM.row}"></crud-modal-destroy>', '', '', function(opts) {

    this.on('update', function() {
        console.log('this.opts',this.VM.row);
    })

});