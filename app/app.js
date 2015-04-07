
		var app = angular.module('flashcards', ['ngRoute','angular.filter']);
		
		app.active_card = 0;
		app.selected_quizzes = [];
		app.activedeck='';		
		
		app.controller('CardController', function($scope, $document){
			this.deck = deck;
			this.available_books = [];
			this.available_questions = [];
			this.available_decks = [{"code":"LTLL-2016-BB","label":"LTLL 2016"}];
			this.selected_deck = "LTLL-2016-BB";
			this.chosen_book_chapters = [];
			this.chosen_set = "";
			this.active_card = 0;
			this.enable_answer_options= this.card && !this.card.answered;
			this.answer_text = "";
			this.current_streak = 0;
			this.correct_total = 0;
			this.incorrect_total = 0;
			this.card = this.available_questions[this.active_card];			
			this.answer_hint = "";
			this.shown = false;
			
			// mousetrap for key bindings 
			Mousetrap.bind('?', function(e) {
				var flashcards = $scope.flashcards;
				if( flashcards.card != null && flashcards.card != 'undefined'){
					 flashcards.toggle_answer_hint();
				}
			});
			
			Mousetrap.bind('.', function(e){ 
				$scope.answer = null;
				$scope.flashcards.get_next_card();
				$scope.$apply();
			});
			
			Mousetrap.bind(',', function(e){ 
				$scope.answer = null;
				$scope.flashcards.get_previous_card();
				$scope.$apply();
			});
			
			/* Localstorage for high scores 
				TODO:vars are hanging out here until I like the implementation
					then will get moved up to the top
			
				available params:
					this.current_streak = 0;
					this.correct_total = 0;
					this.incorrect_total = 0;
			 */
			this.current_pct = function(){
					return this.correct_total/(this.correct_total + this.incorrect_total)*100
			}
			
			this.local_score_save = function() {
			
		  	  if(typeof(Storage)!=="undefined")
		  	    {
					local_storage_support = true;
			  	    if (localStorage.clickcount)
			  	      {
			  	      localStorage.clickcount=Number(localStorage.clickcount)+1;
			  	      }
			  	    else
			  	      {
			  	      localStorage.clickcount=1;
			  	      }
		  	    }
		  	  else
		  	    {
		  	    	local_storage_support = false;
		  	    }

			}
			
			this.local_store_reset = function (){
				
			}
			
			
			this.toggle_answer_hint = function(){
				if( this.shown === false ){
					this.correct_option_text("hint");
					this.answer_hint = this.card.CORRECT_OPTION + " : " + this.answer_text;
					this.shown = true;
					$scope.$apply();					
				} else {
					this.answer_hint="";
					this.shown=false;
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
					  }
				}
			}
			
			this.toggle_options_hide = function(forced_setting) {
				forced_setting = typeof forced_setting !== 'undefined' ? forced_setting : null;
				if( forced_setting === null) {
					this.enable_answer_options = !enable_answer_options;
				} else {
					this.enable_answer_options = !forced_setting;
				};
				return true;
			}
			
			this.fisher_yates_shuffle_available_questions = function() {
				this.clean_available_questions();
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
			
			this.clean_available_questions = function() {
				$.map( this.available_questions, function( question ) {
					if( question.answered === true ){
						question.answered = false;
						question.answered_value = "";
					};
				});
			}
			
			this.update_quiz = function( imo ) {
				this.tear_down_quizzes();
				if( imo.length >= 1 ){
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