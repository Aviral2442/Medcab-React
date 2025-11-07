import BaseVectorMap from '@/components/BaseVectorMap'
import {getUSAMapOptions} from '@/views/maps/vector/data'

import 'jsvectormap'
import 'jsvectormap/dist/maps/us-aea-en'

const USAVectorMap = () => {
    return <BaseVectorMap id="usa-map" options={getUSAMapOptions()} style={{height: 360}}/>
}

export default USAVectorMap
