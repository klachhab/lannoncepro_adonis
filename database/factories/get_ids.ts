import User from "App/Models/User";
import Category from "App/Models/Category";
import DeliveryMode from "App/Models/Post/DeliveryMode";
import City from "App/Models/City";


export const CATEGORY_IDS: Promise<Array<number>> = Category.query()
        .has('parent')
        .select( 'id' )
        .then( category => {
            return category.map( data => data.id );
        } )

export const USER_IDS: Promise<Array<number>> = User.query()
        .select( 'id' )
        .then( users => {
            return users.map( data => data.id );
        } )

export const DELIVERY_MODE_IDS: Promise<Array<number>> = DeliveryMode.query()
        .select( 'id' )
        .then( delivery_modes => {
            return delivery_modes.map( data => data.id );
        } )


export const CITIES_IDS: Promise<Array<number>> = City.query()
        .select( 'id' )
        .then( city => {
            return city.map( data => data.id );
        } )