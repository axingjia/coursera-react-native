import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList ,StyleSheet,Modal,Button,Alert, PanResponder,Share} from 'react-native';
import { DISHES } from '../shared/dishes';
import { COMMENTS } from '../shared/comments';
import { Card, Icon,Rating, Input} from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite,postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
  postFavorite: (dishId) => dispatch(postFavorite(dishId))
  // postComment: (dishId) => dispatch(postFavorite(dishId))
  // postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
  
})

class RenderDish extends Component{
    constructor(props){
        super(props);
        this.state={
            author:"",
            rating:0,
            comment:"",
            commentFormModal:false
        }
    }
    handleViewRef = ref => this.view = ref;
    
    toggleCommentFormModal(){
        this.setState({commentFormModal: !this.state.commentFormModal});
    }
    submitForm(dishId,rating,author,comment){
        // this.props.postComment(dishId);
        // this.props.postComment(dishId, rating, author, comment);
        this.props.postComment(dishId, rating, author, comment);
    }
    render(){
        const shareDish = (title, message, url) => {
            Share.share({
                title: title,
                message: title + ': ' + message + ' ' + url,
                url: url
            },{
                dialogTitle: 'Share ' + title
            })
        }
        
        

        const dish = this.props.dish;
        const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
            if ( dx < -200 )
                return true;
            else
                return false;
        }
        
        const recognizeComment = ({ moveX, moveY, dx, dy }) => {
            if ( dx > 200 )
                return true;
            else
                return false;
        }

        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gestureState) => {
                return true;
            },
            onPanResponderGrant: () => {this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));},
            onPanResponderEnd: (e, gestureState) => {
                console.log("pan responder end", gestureState);
                if (recognizeDrag(gestureState))
                    Alert.alert(
                        'Add Favorite',
                        'Are you sure you wish to add ' + dish.name + ' to favorite?',
                        [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                        ],
                        { cancelable: false }
                    );
                if(recognizeComment(gestureState)){
                    this.toggleCommentFormModal();
                }

                return true;
            }
        })
    
    
        if (dish != null) {
            return(
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000} {...panResponder.panHandlers} ref={this.handleViewRef}>
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={{flex:1,flexDirection:"row",textAlign: 'center',justifyContent: 'center'}}>
                        <Icon
                            raised
                            reverse
                            name={ this.props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => this.props.favorite ? console.log('Already favorite') : this.props.onPress()}
                            />
                        <Icon
                            raised
                            reverse
                            name={ "pencil"}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => {this.toggleCommentFormModal()}}
                            />
                        <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#51D2A8'
                            style={styles.cardItem}
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />
                    </View>
                    <Modal animationType = {"slide"} transparent = {false}
                        visible = {this.state.commentFormModal}
                        onDismiss = {() => this.toggleCommentFormModal() }
                        onRequestClose = {() => this.toggleCommentFormModal() }>
                        <View style = {styles.modal}>
                        <Rating
                            showRating
                            onFinishRating={()=>{console.log('test');}}
                            style={{ paddingVertical: 10 }}
                            onFinishRating={()=>this.setState({rating: newString})}
                            />
                            <Input
                                placeholder="Author"
                                leftIconContainerStyle={{marginRight:10}}
                                onChangeText={(newString)=>this.setState({author: newString})}
                              leftIcon={
                                <Icon
                                  name={'user'}
                                  size={24}
                                  type='font-awesome'
                                  color='black'
                                  
                                />
                              }
                            />
                            
                            <Input
                                placeholder="Comment"
                                leftIconContainerStyle={{marginRight:10}}
                                onChangeText={(newString)=>this.setState({comment: newString})}
                                
                              leftIcon={
                                <Icon
                                  name={'lock'}
                                  size={24}
                                  type='font-awesome'
                                  color='black'
                                  
                                />
                              }
                            />
                            <View style={{marginBottom:20}}>
                            <Button 
                                onPress = {() =>{this.submitForm(dish.id,this.state.rating,this.state.author,this.state.comment);this.toggleCommentFormModal();}}
                                color="#512DA8"
                                title="Submit" 
                                
                                />
                            </View>
                            
                            <Button 
                                onPress = {() =>{this.toggleCommentFormModal();}}
                                color="#ccc"
                                title="Cancel" 
                                />
                        </View>
                    </Modal>
                </Card>
                </Animatable.View>
                
            );
        }
        else {
            return(<View></View>);
        }
    }
}

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}> 
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
        </Animatable.View>
    );
}

class Dishdetail extends Component {
    constructor(props) {
        super(props);
       //  this.state = {
       //     dishes: DISHES,
       //     comments: COMMENTS,
       //     favorites: []
       // };
    }
    markFavorite(dishId) {
        // this.setState({favorites: this.state.favorites.concat(dishId)});
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} 
                    postComment={this.props.postComment}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
	modal: {
       justifyContent: 'center',
       margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);