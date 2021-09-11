import { MDBCard, MDBCol, MDBRow } from "mdbreact";
import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import imagesOfWeather from "../../../dist/obj/imagesOfWeather";
import { toFahrenheit } from 'celsius'
import _ from "lodash";
import { MDBTooltip } from 'mdbreact'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom";
import { getFavorites, deleteFavoriteById } from '../../../redux/favorites/favorites-actions';

//css
import './favoriteList.css'

const FavoriteList = (props) => {

    const [favoritesItems, setFavoritesItems] = useState([])
    const dispatch = useDispatch()
    const history = useHistory()
    let favoritesState = useSelector((state) => state.favoritesReducer.favorites)
    let degreeState = useSelector((state) => state.degreesReducer.degree)

    useEffect(() => {
        dispatch(getFavorites()).then(() => {
            setFavoritesItems(favoritesState)
        })
        localStorage.removeItem('favoritesStorage')
        localStorage.setItem('favoritesStorage', JSON.stringify(favoritesState));
    }, [favoritesState])


    const deleteFavorite = (id) => {
        document.getElementById(`favoritecard${id}`).classList.add('fadeOut')
        debounceDeleteFavorite(id)
    }

    //serach after 0.5 second of type
    const debounceDeleteFavorite = _.debounce((id) => {

        dispatch(deleteFavoriteById(id)).then(() => {
            // 
            setFavoritesItems(favoritesState)
        })
    }, 500);
    return (
        <MDBRow>
            {
                favoritesItems.length > 0 ?
                    favoritesItems.map(f => {
                        // console.log('f', f)
                        return <MDBCol sm='12' lg='4' className='text-center marginAuto animated fadeIn animated fadeIn' key={f.ID}>
                            <MDBCard id={`favoritecard${f.ID}`} style={{ margin: '15px' }} className='customCard cursorPointer animated' onClick={(e) => {
                                // console.log('e', e.target.className)
                                if (e.target.className != 'card__overlay'
                                    && e.target.className != 'card__description bg-danger'
                                    && e.target.tagName != 'A'
                                    && e.target.tagName != 'I') {
                                    history.push({
                                        pathname: '/',
                                        state: {
                                            cityFromFavorites: {
                                                cityKey: f.ID,
                                                cityName: f.Name,
                                                Temperature: {
                                                    Metric: {
                                                        Value: f.Degrees
                                                    }
                                                },
                                                CountryId: f.CountryId,
                                                WeatherText: f.Current
                                            }
                                        }
                                    })
                                }

                            }}>

                                {/* <div className="wrapper">
                                    <div className="ribbon-wrapper-red">
                                        <div className="ribbon-red"></div>
                                    </div>
                                    <div className="ribbon-wrapper-green">
                                        <div className="ribbon-green">KAMPANYA</div>
                                    </div>
                                </div> */}


                                {
                                    f.Name.split(',').map((n, index) => {
                                        return index == 0 ?
                                            <h2 key={`customHeadline${index}`} className='customHeadline' style={{ marginTop: '50px' }}> {n}</h2>
                                            :
                                            // <h3 className='fontVarianteSmallCaps customHeadline'>{n}</h3>

                                            <div key={`wrapper${index}`} className="wrapper">
                                                <div className="ribbon-wrapper-red">
                                                    <div className="ribbon-country"><span className='fontVarianteSmallCaps'
                                                        style={n.length > 8 ? { fontSize: 'x-small' } : {}}
                                                    >{n}</span></div>

                                                </div>
                                                <div className="ribbon-wrapper-green"
                                                >
                                                    <div className="ribbon-green"><img className=''
                                                        src={`https://www.countryflags.io/${f.CountryId != undefined ? f.CountryId : ''}/shiny/64.png`}>
                                                    </img></div>
                                                </div>
                                            </div>

                                    })
                                }
                                {/* <img width='50' height='50' className='marginAuto'
                                    src={`https://www.countryflags.io/${f.CountryId != undefined ? f.CountryId : ''}/flat/64.png`}>
                                </img> */}
                                <p className='font-italic'>{f.Current}</p>
                                {
                                    imagesOfWeather.map(image => {
                                        if (f.Current.includes(`${image.type}`)) {
                                            return <img key={image.id}
                                                className='imageOfWeather'
                                                src={image.src}
                                                alt={image.alt} height="50"
                                            />
                                        }
                                    })
                                }
                                <p style={{ fontSize: 'x-large' }}>
                                    {
                                        degreeState == 'Celsius' ?
                                            <span id='degrees'> {f.Degrees}° <sup></sup></span>
                                            : <span id='degrees'> {toFahrenheit(f.Degrees)}<sup>℉</sup></span>
                                    }
                                </p>
                                {/* {
                                        f.Current.includes('Sunny') ?
                                            <i className="fas fa-sun fa-2x"></i>
                                            : f.Current.includes('cloud') ?
                                                f.Current.includes('shower') ?
                                                    <i className="fas fa-cloud-moon-rain fa-2x"></i>
                                                    : <i className="fas fa-cloud-sun fa-2x"></i>
                                                : f.Current.includes('Clowdy') ?
                                                    <i className="fas fa-cloud-sun fa-2x"></i>
                                                    : ''
                                    } */}
                                {/* <br /> */}
                                <div className="card__overlay">
                                    <div className='card__description bg-danger'>
                                        <a
                                            className='trashLink'

                                        >
                                            <MDBTooltip
                                                domElement
                                                tag="span"
                                                placement="top"
                                            >
                                                <i className="fas fa-trash animated fadeIn text-white" onClick={() => deleteFavorite(f.ID)}></i>

                                                <span>Delete</span>
                                            </MDBTooltip>

                                        </a>
                                    </div>
                                </div>


                            </MDBCard>
                        </MDBCol>
                    })
                    :
                    <MDBCol sm='12'>
                        <MDBCard className='text-center'>
                            <h2>Favorite list is Empty</h2>
                            <Link to='/'>
                                <i className="far fa-plus-square fa-5x cursorPointer"></i>
                            </Link>
                        </MDBCard>
                    </MDBCol>
            }
        </MDBRow >
    )
}
export default FavoriteList
