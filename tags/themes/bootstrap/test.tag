<my-custom-tag>
    <h2>Name:{mytitle}</h2>
    <button onclick={clickTest}>test</button>
    <script>
        this.mixin('OptsMixin');
    </script>
</my-custom-tag>

<my-custom-tag-parent>
    <h2>my-custom-tag-parent</h2>
    <my-custom-tag mytitle="mytagN1"></my-custom-tag>
    <my-custom-tag mytitle="mytagN2"></my-custom-tag>
</my-custom-tag-parent>