# cord-js
Connects a react app to a cord compliant API.

```
  yarn add cord
```

### CordStore
The cord store manages all requests and their responses, it also holds all the data. It is required for cord to function.

#### Creating the store

```
# cord_store.js

import { CordStore } from 'cord'

export default new CordStore({
  base_url: 'www.example.com/api/v1/',
})
```

#### Adding the store to the application

```
# app.jsx

import { Provider } from 'cord'
import cordStore from './cord_store'

<Provider store={cordStore}>
  <Application />
</Provider>
```

### Creating a cord
Before you can connect a component you must first build a cord. A cord details what the connection contains, what actions can perform, what the address is...

```
import { Cord } from 'cord'

export default new Cord('article', {
  path: 'article',
  table_name: 'articles'
})
```

### Using a cord

#### connection methods
You can connect ids to a component like this:
```
import myCord from './cords/my_cord'

@myCord.connectIds()
class MyComponent extends React.Component {}
```

it has many signitures: 
```
cord.connectIds(scope_name)           # this will pass a prop to the component of scope_name_ids with an array of those ids
cord.connectIds([scope_1, scope_2])   # same as above but with multiple arrays
cord.connectIds({                     # connects scopes but with custom prop names
  my_ids: { scope: 'all' },
  other_ids: { scope: 'published' }
})
cord.connectIds((props) => {          # you can pass a function to get props
  return {
    my_ids: { scope: 'all' },
    other_ids: { scope: 'published' query: props.query }
  }
})
```
