import React, { Component } from 'react';
import Loading from "./Loading";
import Header from "./Header";
import Item from './Item';
import Footer from './Footer';
import Add from './Add';
import { getVideos } from '../Api';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            videos: null,
            error: null,
            showAdd: false
        };
        this.handleAdd = this.handleAdd.bind(this); //this way i have access to the state
        this.handleCloseAdd = this.handleCloseAdd.bind(this);
    }
    async componentDidMount() {
        this.setState({isLoading:true});
        try {
            const videos = await getVideos();
            this.setState({videos, isLoading: false});
        } catch (error) {
            this.setState({error, isLoading:false});
        }
        return true;
    }
    handleAdd(e) {
        e.preventDefault();
        this.setState({showAdd:true});
    }
    handleCloseAdd(reload){
        return () => {
            if(reload){
                this.setState({ isLoading: true , showAdd:false});
                getVideos().then(data => this
                    .setState({ videos: data, isLoading: false, showAdd:false }))
                    .catch(error => this.setState({ error, isLoading: false, showAdd:false }));
            } else {
                this.setState({ showAdd: false });
            }
        }
    }
    render() {
        const { videos, isLoading, error } = this.state;
        if (error) {
            return (<div> Error</div>);
        }
        if (isLoading) {
            return (<Loading message="Cargando ..." />);
        }
        return (<React.Fragment>
            <Header onClickAdd={this.handleAdd} />
            <div className="container">
                <div className="grid-container">
                    {
                        videos && videos.map((video, i) => {
                            return (<Item key={i} data={video} />)
                        })
                    }
                </div>
            </div>
            { this.state.showAdd && (<Add onClose={this.handleCloseAdd}/>) }
            <Footer />
            </React.Fragment>);
    }
}

export default List;
