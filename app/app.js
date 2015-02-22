//TODO : Storing data inside a controller isn't my idea of a "good idea" move it out of here when you understand AngularJS :)
// (function ()
	// {
		var app = angular.module('flashcards', ['ngRoute','angular.filter']);
		
		app.active_card = 0;
		app.selected_quizzes = [];
		app.activedeck='';
		// app.controller('viewController', function ($scope, $document) {
		// 	//everything removed from here so this is merely a token of the product's evolution
		// 	// $document.bind("keypress", function(event) {
		// 	// 		if( event.charCode === 97){
		// 	// 			var flashcards = $scope.flashcards;
		// 	// 			if( flashcards.card != null && flashcards.card != 'undefined'){
		// 	// 				// $scope.flashcards.answer = flashcards.card.CORRECT_OPTION;
		// 	// 				// $scope.answer = {};
		// 	// 				// flashcards.correct_option_text(flashcards.card.CORRECT_OPTION);
		// 	// 				// console.debug( $scope.answer );
		// 	// 				// console.log("value is: " + flashcards.answer_text );
		// 	// 				 // $scope.flashcards.answer = flashcards.card.CORRECT_OPTION;
		// 	// 				 // $scope.answer = flashcards.card.CORRECT_OPTION;
		// 					$scope.flashcards.show_the_answer();
		// 	// 			}
		// 	// 		};
		// 	//     });
		//     }
		// );
		
		
		app.controller('CardController', function($scope, $document){
			this.deck = deck;
			this.available_books = [];
			this.available_questions = [];
			this.available_decks = [{"code":"LTLL-2015-BB","label":"LTLL 2015"}];
			this.selected_deck = "LTLL-2015-BB";
			this.chosen_book_chapters = [];
			this.chosen_set = "";
			this.active_card = 0;
			this.enable_answer_options= this.card && !this.card.answered;
			this.answer_text = "";
			this.current_streak = 0;
			this.correct_total = 0;
			this.incorrect_total = 0;
			// this.sets_to_iterate = [];
			this.card = this.available_questions[this.active_card];			
			this.answer_hint = "";
			this.shown = false;
			
			$document.bind("keypress", function(event) {
					if( event.charCode === 97){
						var flashcards = $scope.flashcards;
						if( flashcards.card != null && flashcards.card != 'undefined'){
							 flashcards.show_the_answer();
						}
					};
			    });
			
			this.show_the_answer = function(){
				if( this.shown === false ){
					this.correct_option_text("hint");
					this.answer_hint = this.card.CORRECT_OPTION + " : " + this.answer_text;
					this.shown = true;
					$scope.$apply();					
				};
			};
			
			this.get_first_card = function(){
				this.active_card = 0;
				this.card = this.available_questions[this.active_card];
				this.enable_answer_options=!this.card.answered;
				this.answer_hint = ""; 
				this.shown = false;
			};
			
			this.get_next_card = function() {
				if( this.active_card < this.available_questions.length - 1 ) {
					this.active_card = this.active_card + 1;
					this.card = this.available_questions[this.active_card];
					this.enable_answer_options=!this.card.answered;
					this.answer_hint = "";
					this.shown = false;
				}
				
			};
			this.get_previous_card = function() {
				if( this.active_card > 0 ) {
					this.active_card = this.active_card - 1;
					this.card = this.available_questions[this.active_card];
					this.enable_answer_options=!this.card.answered;
					this.answer_hint = "";
					this.shown = false;
				}
			};
			
			this.correct_option_text = function(selected_option) {
				// console.log("setting option text for '" + selected_option + "'");
				selected_option = typeof selected_option !== 'undefined' ? selected_option : null;
				if( selected_option === this.card.CORRECT_OPTION && !this.card.answered){
					this.current_streak += 1;
					this.correct_total +=1;
					this.card.answered = true;
					this.card.answered_value = selected_option;
				} else if (selected_option != "hint" && !this.card.answered){
					this.current_streak = 0;
					this.incorrect_total += 1;
					this.card.answered = true;
					this.card.answered_value = selected_option;
				};
				
   			   	switch(this.card.CORRECT_OPTION){
   					case "A":
   						this.answer_text = this.card.CHOICE_A;
						break;
   					case "B":
   						this.answer_text =  this.card.CHOICE_B;
						break;
   					case "C":
   						this.answer_text =  this.card.CHOICE_C;
						break;
					case "D":
   						this.answer_text =  this.card.CHOICE_D;
						break;
   					default:
   						this.answer_text =  "undefined source selection";
						break;
   				}				
			};
			
			this.update_books = function() {
				var lookup = {};
				var items = this.deck;
				var result = [];

				for (var item, i = 0; item = items[i++];) {
				  var book = {
					    "BOOK":item.BOOK,
					    "BOOK_NUMBER":item.BOOK_NUMBER,
					  	"CHAPTER":item.CHAPTER
					  }

				  if (!(book.BOOK+book.CHAPTER in lookup)) {
				    lookup[book.BOOK+book.CHAPTER] = 1;
				    result.push(book);
				  }
				}
				this.available_books = result;
			}
			
			this.tear_down_quizzes = function(){
				this.available_questions = [];
				this.active_card = 0;
				this.enable_answer_options = this.card && !this.card.answered;
				this.current_streak = 0;
				this.correct_total = 0;
				this.incorrect_total = 0;
				this.answer_hint = "";
				this.shown = false;
			}
			
			this.add_to_quizzes = function(quizset, booknum, chapter){
				// console.log( "Handling: set: " + quizset + " Book Number: " + booknum + " Chapter: " + chapter );
				//get all of the questions for this book and chapter.
				var lookup = {};
				var items = this.deck;
				var result = [];
				var counter = 0;
				for (var item, i = 0; item = items[i++];) {
				  var question = {
					    "BOOK":item.BOOK,
					    "BOOK_NUMBER":item.BOOK_NUMBER,
					  	"CHAPTER":item.CHAPTER,
						"QUESTION_NUMBER":item.QUESTION_NUMBER,
						"SEQUENCE":item.SEQUENCE,
						"BCQ_KEY":item.BCQ_KEY,
						"CORRECT_OPTION":item.CORRECT_OPTION,
						"QUESTION":item.QUESTION,
						"CHOICE_A":item.CHOICE_A,
						"CHOICE_B":item.CHOICE_B,
						"CHOICE_C":item.CHOICE_C,
						"CHOICE_D":item.CHOICE_D,
						"CARD_SET":item.CARD_SET
					  };
					
					  if( question.BOOK_NUMBER==booknum && question.CHAPTER==chapter ){
	  					if (!(question.BOOK_NUMBER+question.CHAPTER+question.SEQUENCE in lookup)) {
	  						lookup[question.BOOK+question.CHAPTER+question.SEQUENCE] = 1;
	  						result.push(question);
	  						counter++; 
	  						this.available_questions.push(question);
	  					}

	    					// console.log( "loaded: set: " + question.CARD_SET + " Book Number: " + question.BOOK_NUMBER + " Chapter: " + question.CHAPTER + " count: " + question.QUESTION_NUMBER );
					  }

				}
				// this.available_questions.push(result);
			}
			
			this.toggle_options_hide = function(forced_setting) {
				forced_setting = typeof forced_setting !== 'undefined' ? forced_setting : null;
				// console.log("doing a toggle");
				if( forced_setting === null) {
					// console.log("toggle getting a null");
					this.enable_answer_options = !enable_answer_options;
				} else {
					// console.log("toggle getting : " + forced_setting + "so we will change var to : " + !forced_setting);
					this.enable_answer_options = !forced_setting;
					// console.log("enable_answer_options : " + this.enable_answer_options );
				};
				return true;
			}
			
			this.fisher_yates_shuffle_available_questions = function() {
				for (i=this.available_questions.length-1; i>0; i--) {
					var swap_pos_to_back = Math.floor( Math.random() * i );
					var swap_to_front_val = this.available_questions[i];
					this.available_questions[i] = this.available_questions[swap_pos_to_back];
					this.available_questions[swap_pos_to_back] = swap_to_front_val;
				};	
				this.active_card = 0;
				this.current_streak = 0;
				this.correct_total = 0;
				this.incorrect_total = 0;
				this.answer_hint = "";
				this.shown = false;
			};
			
			this.update_quiz = function( imo ) {
				//We are expecting an object array.
				this.tear_down_quizzes();
				if( imo.length >= 1 ){
					//iterate the object array and apply the logic
					for( i=0; i<imo.length; i++){
						var bookitem = imo[i];
						this.add_to_quizzes( "" + this.selected_deck, "" + bookitem.BOOK_NUMBER, "" + bookitem.CHAPTER );
					}
				}
				if( this.available_questions.length>0 ){
					this.card = this.available_questions[this.active_card];
				}
			}
			
		});

	// }
// )();