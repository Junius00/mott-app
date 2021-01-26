import { Button, CircularProgress, Grid, List, ListItem, Typography } from '@material-ui/core';
import React, { RefObject } from 'react';
import Restaurant, { restaurantInput } from '../../../models/restaurant/Restaurant';
import { getOpenRestaurants, getOpenRestaurantsInput } from '../../../services/api/restaurantsServices';
import ApiResponse from '../../../services/classes/ApiResponse';
import { getAuthTokenFromStorage } from '../../../sessionStorage/storageServices';
import RestaurantGridItem from '../gridItems/RestaurantGridItem';

type RestaurantsDisplayGridProps = {
    setPopUpChild: (child: JSX.Element) => void,
    togglePopUp: () => void,
    time: number,
    day: string,
    perPage?: number,
    sortBy?: string
};

type RestaurantDisplayGridState = {
    restaurants: Array<Restaurant>,
    loading: boolean,
    page: number,
    prevY: number
};

export default class RestaurantsDisplayGrid extends React.Component<RestaurantsDisplayGridProps, RestaurantDisplayGridState> {
    observer: IntersectionObserver;
    loadingRef: RefObject<HTMLDivElement>;

    constructor(props: RestaurantsDisplayGridProps) {
        super(props);
        this.state = {
            restaurants: [],
            loading: false,
            page: 1,
            prevY: 0
        };

        this.observer = new IntersectionObserver(
            this.handleObserver.bind(this),
            {
                root: null,
                rootMargin: '0px',
                threshold: 1.0
            }
        );
        this.loadingRef = React.createRef<HTMLDivElement>();
    }

    async getRestaurants(page: number) {
        this.setState({ loading: true });
        let restaurantOptions: getOpenRestaurantsInput = {
            authToken: getAuthTokenFromStorage()!,
            time: this.props.time,
            day: this.props.day,
            page: this.state.page
        };

        if (this.props.perPage) restaurantOptions.perPage = this.props.perPage;
        if (this.props.sortBy) restaurantOptions.sortBy = this.props.sortBy;

        let apiResponse: ApiResponse = await getOpenRestaurants(restaurantOptions);

        if (!apiResponse.success) {
            this.setState({ loading: false });
            return;
        }

        const restaurants: Array<restaurantInput> = apiResponse.body!.openRestaurants;
        
        if (!restaurants) {
            this.setState({ loading: false });
            return;
        }

        this.setState({
            restaurants: [...this.state.restaurants, ...restaurants.map(r => new Restaurant(r))],
            loading: false
        })
    }

    handleObserver(entities: IntersectionObserverEntry[], observer: IntersectionObserver) {
        const y = entities[0].boundingClientRect.y;
        if (this.state.prevY > y) {
          const newPage = this.state.page + 1;
          this.getRestaurants(newPage);
          this.setState({ page: newPage });
        }

        this.setState({ prevY: y });
    }

    componentDidMount() {
        this.getRestaurants(this.state.page);
        if (this.loadingRef && this.loadingRef.current) this.observer.observe(this.loadingRef.current);
    }

    componentWillUnmount() {
        if (this.loadingRef && this.loadingRef.current) this.observer.unobserve(this.loadingRef.current);
    }

    render() {
        const hasRestaurants: boolean = this.state.restaurants.length > 0;
        return (
            <List>
                <ListItem>
                    <Grid
                        container
                        spacing={3}
                    >
                        {   
                            hasRestaurants
                            ? this.state.restaurants.map(restaurant => (
                                <RestaurantGridItem 
                                    key={restaurant.closingTime + restaurant.name}
                                    restaurant={restaurant}
                                    togglePopUp={this.props.togglePopUp}
                                    setPopUpChild={this.props.setPopUpChild}
                                />
                            ))
                            : <Typography align='center'>no restaurants open now. try again another time?</Typography>
                        }
                    </Grid>
                </ListItem>
                <ListItem>
                    <div
                        ref={this.loadingRef}
                        style={{height: '20vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                    >
                        { 
                        (this.state.loading && hasRestaurants) 
                            ? <CircularProgress /> 
                            : (hasRestaurants) ? <Button fullWidth> Load more </Button> : null
                        }
                    </div>
                </ListItem>
            </List>   
        );
    }
}