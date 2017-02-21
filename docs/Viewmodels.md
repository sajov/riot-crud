#Views

A view is a crud representation of a Service or Data Model.
Each view 

## Create, View, Edit

### Mount
```html

<my-custom-view-tag

>    
</my-custom-view-tag>

```


### Options 
#### RiotCrudModel.addModel('name', options)
#### RiotCrudController.addRoute('name', options)


| Option         | Type    | Views | Default   | Description |
|----------------|---------|-------|-----------|-------------|
| name           | string  | all   |           |             |
| title          | string  | all   |           |             |
| description    | string  | all   |           |             |
| showheader     | string  | all   |           |             |
| showheader     | string  | all   |           |             |
| service        | string  | all   |           |             |
| servicename    | string  | all   |           | deprecated  |
| schema         | mixed   | all   |           |             |
| target         | string  | all   |           |             |
| endpoint       | string  | all   |           |             |
| tag            | string  | all   |           |             |
| idfield        | string  | all   | '_id'     |             |
| dependencies   | array   | all   |           |             |
| menu           | boolean | all   |           |             |
| menuGroup      | boolean | all   |           |             |
| icon           | string  | all   |           |             |
| buttons        | array   | all   |           |             |
| selection      | boolean | list  |           |             |
| filterable     | boolean | list  |           |             |
| columns        | object  | list  |           |             |
| fn             | function| all   |           |             |



### Methods

## Routing
