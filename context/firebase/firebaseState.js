import React, {useReducer} from 'react';
import firebase from '../../firebase';
import FirebaseReducer from './firebaseReducer';
import FirebaseContext from './firebaseContext';
import {OBTENER_PRODUCTOS_EXITO} from '../../types';
import _ from "lodash"
const FirebaseState = (props) => {
  //crear state inicial

  const initialState = {
    menu: [],
  };

  //use reducer con dispatch para ejecutar las funciones
  const [state, dispatch] = useReducer(FirebaseReducer, initialState);
  const obtenerProductos = () => {
    //consultar firebase
    firebase.db
      .collection('productos')
      .where('existencia', '==', true)
      .onSnapshot(manejarSnapshot);

    function manejarSnapshot(snapshot) {
      let platillos = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      //ordenar por categoria lodash
      platillos = _.sortBy(platillos , 'categoria')
     // console.log(platillos);
      dispatch({
        type: OBTENER_PRODUCTOS_EXITO,
        payload: platillos,
      });
    }
   
  };

  return (
    <FirebaseContext.Provider
      value={{menu: state.menu, firebase, obtenerProductos}}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseState;
