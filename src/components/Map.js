/* src/App.js */
import React, { useRef, useEffect, createRef, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { drawLayers, drawPositionsOnMap } from './randomFunctions';
import { StoreContext } from './Store';
import { isEmpty } from 'lodash'
import { useObserver } from 'mobx-react'
import { toJS } from 'mobx';

// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker'


mapboxgl.workerClass = MapboxWorker
mapboxgl.accessToken = ''



export const Map = () => {

    
    const mapContainer = useRef(null);
    /* References */
    const store = useContext(StoreContext)
    const map = useRef();
    // initialize map when component mounts
    useEffect(() => {
        if (isEmpty(map.current)) {
            const checkt = store.renderMapTrigger;
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                // See style options here: https://docs.mapbox.com/api/maps/#styles
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [23.648192337, 60.06553424],
                zoom: 10,
            });
            // add navigation control (the +/- zoom buttons)
            map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        } else {

            const positionsAsJsArray = toJS(store.positions);
            if (!isEmpty(positionsAsJsArray)) {
                if (!store.positionsDrawn) {
                    store.clearMap();
                    drawPositionsOnMap(positionsAsJsArray, map.current, store);
                    store.positionsDrawn = true;
                }
            }
        }
        // clean up on unmount
        //return () => map.current.remove();
    }, [store.renderMapTrigger]);

    const observeMapChanges = () => {
        if (store.renderMapTrigger) {
            return null
        }
    }

    return useObserver(() => (
        <div>
            {observeMapChanges()}
            <div className={'map-container'} ref={mapContainer} />
        </div>
    ))
};



//export default observer(Map);