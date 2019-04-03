import React, { Component } from 'react';
import { View, FlatList,Text } from 'react-native';
import { Card } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

export default class Contact extends Component{
	constructor(props){
		super(props);
	}
	render(){
		const string=
		`121, Clear Water Bay Road
Clear Water Bay, Kowloon
HONG KONG
Tel: +852 1234 5678
Fax: +852 8765 4321
Email:confusion@food.net`;
		const textchunk=string.split('\n').map(function(currentValue,index){
			return(<Text key={index}>{currentValue}</Text>)
		});
		return(
			<Animatable.View animation="fadeInDown" duration={2000} delay={1000}>   
			<Card
				featuredTitle={"Contact Info"}
				
				>
			
				
				{textchunk}
			
			</Card>
			</Animatable.View>
		)
	}
}