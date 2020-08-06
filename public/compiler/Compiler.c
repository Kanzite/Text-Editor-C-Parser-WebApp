#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "LexicalAnalyzer.h"

struct tokenstructure next;
int flag = 0;

void Program();
void Declarations();
void Identifier_List();
void Statement_List();
void Statement();
void Assign_Stat();
void Expn();
void EPrime();
void Simple_Exp();
void SEPrime();
void Term();
void TPrime();
void Factor();
void Decision_Stat();
void DPrime();
void Looping_Stat();
void Switch_Case();
void SCPrime();

void Error(char func[], char str[], char sync[][50]) {
	printf("\nError in %s (Line: %d, Column: %d).\n%s Required.\n\n", func, next.row, next.col, str);
	if(!strcmp(next.type, "EOL")) {
		printf("Parsing Complete\n");
		exit(0);
	}
	while(1) {
		flag = 0;
		next = getNextToken();
		for(int i = 0; ; i++) {
			if(!strcmp(next.lexemename, sync[i]) || !strcmp(next.type, sync[i])) {
				flag = 1;
				break;
			}
			if(!strcmp(sync[i], "$"))
				break;
		}
		if(flag)
			break;
	}
	printf("\nResuming Compilation From '%s' (Line: %d, Column: %d).\n\n", next.lexemename, next.row, next.col);
	if(!strcmp(next.type, "EOL")) {
		printf("Parsing Complete\n");
		exit(0);
	}
}

void SCPrime() {
	char sync[][50] = {"if", "while", "for", "}", "Identifier", "$"};
	if(!strcmp(next.lexemename, "default")) {
		next = getNextToken();
		if(!strcmp(next.lexemename, ":"))
			next = getNextToken();
		else
			Error("SCPrime", ":", sync);
		Statement_List();
	}
}

void Switch_Case() {
	char sync[][50] = {"if", "while", "for", "}", "Identifier", "$"};
	if(!strcmp(next.lexemename, "case")) {
		next = getNextToken();
		if(!strcmp(next.type, "Numerical Constant")) {
			next = getNextToken();
			if(!strcmp(next.lexemename, ":"))
				next = getNextToken();
			else
				Error("Switch_Case", ":", sync);
		}
		else
			Error("Switch_Case", "Number", sync);
		Statement_List();
		if(!strcmp(next.lexemename, "break")) {
			next = getNextToken();
			if(!strcmp(next.lexemename, ";"))
				next = getNextToken();
		}
		Switch_Case();
		SCPrime();
	}
}

void Looping_Stat() {
	char sync[][50] = {"if", "while", "for", "}", "Identifier", "$"};
	if(!strcmp(next.lexemename, "while")) {
		next = getNextToken();
		if(!strcmp(next.lexemename, "("))
			next = getNextToken();
		else
			Error("Looping_Stat", "(", sync);
		Expn();
		if(!strcmp(next.lexemename, ")")) {
			next = getNextToken();
			if(!strcmp(next.lexemename, "{")) 
				next = getNextToken();
			else
				Error("Looping_Stat", "{", sync);
		}
		else
			Error("Looping_Stat", ")", sync);
		Statement_List();
		if(!strcmp(next.lexemename, "}")) { }
		else
			Error("Looping_Stat", "}", sync);
		next = getNextToken();
	}
	else if(!strcmp(next.lexemename, "do")) {
		next = getNextToken();
		if(!strcmp(next.lexemename, "{"))
			next = getNextToken();
		else
			Error("Looping_Stat", "{", sync);
		Statement_List();
		if(!strcmp(next.lexemename, "}")) {
			next = getNextToken();
			if(!strcmp(next.lexemename, "while")) {
				next = getNextToken();
				if(!strcmp(next.lexemename, "("))
					next = getNextToken();
				else
					Error("Looping_Stat", "(", sync);
			}
			else
				Error("Looping_Stat", "while", sync);
		}
		else
			Error("Looping_Stat", "}", sync);
		Expn();
		if(!strcmp(next.lexemename, ")")) {
			next = getNextToken();
			if(!strcmp(next.lexemename, ";"))
				next = getNextToken();
			else
				Error("Looping_Stat", ";", sync);
		}
		else
			Error("Looping_Stat", ")", sync);
	}
	else if(!strcmp(next.lexemename, "for")) {
		next = getNextToken();
		if(!strcmp(next.lexemename, "("))
			next = getNextToken();
		else
			Error("Looping_Stat", "(", sync);
		Assign_Stat();
		if(!strcmp(next.lexemename, ";"))
			next = getNextToken();
		else
			Error("Looping_Stat", ";", sync);
		Expn();
		if(!strcmp(next.lexemename, ";"))
			next = getNextToken();
		else
			Error("Looping_Stat", ";", sync);
		Assign_Stat();
		if(!strcmp(next.lexemename, ")")) {
			next = getNextToken();
			if(!strcmp(next.lexemename, "{"))
				next = getNextToken();
			else
				Error("Looping_Stat", "{", sync);
		}
		else
			Error("Looping_Stat", ")", sync);
		Statement_List();
		if(!strcmp(next.lexemename, "}")) { }
		else
			Error("Looping_Stat", "}", sync);
		next = getNextToken();
		
	}
}

void DPrime() {
	char sync[][50] = {"if", "else", "while", "for", "}", "Identifier", "$"};
	if(!strcmp(next.lexemename, "else")) {
		next = getNextToken();
		if(!strcmp(next.lexemename, "{"))
			next = getNextToken();
		else
			Error("DPrime", "{", sync);
		Statement_List();
		if(!strcmp(next.lexemename, "}")) { }
		else
			Error("DPrime", "}", sync);
		next = getNextToken();
	}
}

void Decision_Stat() {
	char sync[][50] = {"if", "while", "for", "}", "Identifier", "$"};
	if(!strcmp(next.lexemename, "if")) {
		next = getNextToken();
		if(!strcmp(next.lexemename, "("))
			next = getNextToken();
		else
			Error("Decision_Stat", "(", sync);
		Expn();
		if(!strcmp(next.lexemename, ")")) {
			next = getNextToken();
			if(!strcmp(next.lexemename, "{"))
				next = getNextToken();
			else
				Error("Decision_Stat", "{", sync);
		}
		else
			Error("Decision_Stat", ")", sync);
		Statement_List();
		if(!strcmp(next.lexemename, "}")) { }
		else
			Error("Decision_Stat", "}", sync);
		next = getNextToken();
		DPrime();
	}
	else if(!strcmp(next.lexemename, "switch")) {
		next = getNextToken();
		if(!strcmp(next.lexemename, "("))
			next = getNextToken();
		else
			Error("Decision_Stat", "(", sync);
		Expn();
		if(!strcmp(next.lexemename, ")")) {
			next = getNextToken();
			if(!strcmp(next.lexemename, "{"))
				next = getNextToken();
			else
				Error("Decision_Stat", "{", sync);
		}
		else
			Error("Decision_Stat", ")", sync);
		Switch_Case();
		if(!strcmp(next.lexemename, "}")) { }
		else
			Error("Decision_Stat", "}", sync);
		next = getNextToken();
	}
}

void Factor() {
	if(!strcmp(next.type, "Numerical Constant") || !strcmp(next.type, "Identifier"))
		next = getNextToken();
}

void TPrime() {
	if(!strcmp(next.type, "Arithmetic Mul/Div/Mod Operator")) {
		next = getNextToken();
		Factor();
		TPrime();
	}
}

void Term() {
	Factor();
	TPrime();
}

void SEPrime() {
	if(!strcmp(next.type, "Arithmetic Add/Sub Operator")) {
		next = getNextToken();
		Term();
		SEPrime();
	}
}

void Simple_Exp() {
	Term();
	SEPrime();
}

void EPrime() {
	if(!strcmp(next.type, "Relational Operator")) {
		next = getNextToken();
		Simple_Exp();
	}
}

void Expn() {
	Simple_Exp();
	EPrime();
}

void Assign_Stat() {
	char sync[][50] = {";", ")", "Identifier", "$"};
	if(!strcmp(next.type, "Identifier")) {
		next = getNextToken();
		if(!strcmp(next.type, "Assignment Operator"))
			next = getNextToken();
		else
			Error("Assign_Stat", "=", sync);
		Expn();
	}
}

void Statement() {
	char sync[][50] = {"if", "while", "for", "}", "Identifier", "$"};
	if(!strcmp(next.type, "Identifier")) {
		Assign_Stat();
		if(!strcmp(next.lexemename, ";"))
			next = getNextToken();
		else
			Error("Statement", ";", sync);
	}
	else if(!strcmp(next.lexemename, "if") || !strcmp(next.lexemename, "switch"))
		Decision_Stat();
	else if(!strcmp(next.lexemename, "while") || !strcmp(next.lexemename, "for") || !strcmp(next.lexemename, "do"))
		Looping_Stat();
	else
		Error("Statement", "Assignment, Conditional or Iterative Statement", sync);
}

void Statement_List() {
	if(!strcmp(next.type, "Identifier") || !strcmp(next.lexemename, "if") || !strcmp(next.lexemename, "switch") || !strcmp(next.lexemename, "while") || !strcmp(next.lexemename, "for")|| !strcmp(next.lexemename, "do")) {
		Statement();
		Statement_List();
	}
}

void Identifier_List() {
	char sync[][50] = {";", "Identifier", "$"};
	if(!strcmp(next.type, "Identifier"))
		next = getNextToken();
	else
		Error("Identifier_List", "Identifier", sync);
	if(!strcmp(next.lexemename, ",")) {
		next = getNextToken();
		Identifier_List();
	}
	else if(!strcmp(next.lexemename, "[")) {
		next = getNextToken();
		if(!strcmp(next.type, "Numerical Constant")) {
			next = getNextToken();
			if(!strcmp(next.lexemename, "]")) {
				next = getNextToken();
				if(!strcmp(next.lexemename, ",")) {
					next = getNextToken();
					Identifier_List();
				}
			}
			else
				Error("Identifier_List", "]", sync);
		}
		else
			Error("Identifier_List", "Number", sync);
	}
}

void Declarations() {
	char sync[][50] = {"int", "char", "if", "while", "for", "}", "Identifier", "$"};
	if(!strcmp(next.lexemename, "int") || !strcmp(next.lexemename, "char")) {
		next = getNextToken();
		Identifier_List();
		if(!strcmp(next.lexemename, ";"))
			next = getNextToken();
		else
			Error("Declarations", ";", sync);
		Declarations();
	}
}

void Program() {
	char sync[][50] = {"main", "$"};
	if(!strcmp(next.lexemename, "main")) { }
	else
		Error("Program", "main", sync);
	next = getNextToken();
	if(!strcmp(next.lexemename, "(")) {
		next = getNextToken();
		if(!strcmp(next.lexemename, ")")) {
			next = getNextToken();
			if(!strcmp(next.lexemename, "{")) {
				next = getNextToken();
				Declarations();
				Statement_List();
				if(!strcmp(next.lexemename, "}"))
					next = getNextToken();
				else 
					Error("Program", "}", sync);
			}
			else
				Error("Program", "{", sync);
		}
		else
			Error("Program", ")", sync);
	}
	else
		Error("Program", "(", sync);
}

void main() {
	PreProcess();
	LexicalAnalyzer();
	next = getNextToken();
	Program();
	LexClose();
	if(!strcmp(next.type, "EOL"))
		printf("\nParsing Complete\n");
	else
		printf("\nError In Main\n");
}