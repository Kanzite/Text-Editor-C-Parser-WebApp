#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define MAX 50
#define HASH 5

struct symbolNode {
	int id;
	char name[50];
	char type[50];
	int size;
	char scope;
	int argc;
	int args[10];
	char rettype[50];
};

struct tokenstructure {
	char lexemename[100];
	int row, col;
	char type[50];
};

struct Node {
	struct symbolNode symbolRow;
	struct Node *next;
};

struct Node *Table[MAX];
struct tokenstructure token[250];
int globalid = 0, ind = 0;

FILE *fileone;
char charone, buf[1000];
char database[14][10] = {"default","int","char","float","double","switch","break","if","else","for","return","case","do","while"};
int row = 1, col = 1, tokenflag = 0;

struct tokenstructure StoreToken(char ln[], int r, int c, char t[]) {
	strcpy(token[ind].lexemename,ln);
	token[ind].row = r;
	token[ind].col = c;
	strcpy(token[ind].type,t);
	struct tokenstructure tokencur = token[ind];
	ind++;
	tokenflag = 1;
	return tokencur;
}

void PreProcess() {
	FILE *fileone, *filetwo;
	int charone, chartwo;
	fileone = fopen("public/compiler/Input.c","r");
	if(fileone == NULL) {
		printf("Cannot Open File!");
		exit(0);
	}
	filetwo = fopen("public/compiler/PreProcess.c","w");
	charone = getc(fileone);
	while(charone != EOF) {
		if(charone == '#') {
			do {
				charone = getc(fileone);
			} while(charone != '\n');
			charone = getc(fileone);
		}
		else if(charone == '\t' || charone == ' ') {
			putc(' ',filetwo);
			do {
				charone = getc(fileone);
			} while((charone == ' ' || charone == '\t') && charone != EOF);
		}
		else if(charone == '"') {
			do {
				putc(charone,filetwo);
				charone = getc(fileone);
			} while(charone != '"' && charone != EOF);
			putc(charone,filetwo);
			charone = getc(fileone);
		}
		else if(charone == '/') {
			chartwo = getc(fileone);
			if(chartwo == '/') {
				do {
					chartwo = getc(fileone);
				} while(chartwo != '\n');
				putc(chartwo,filetwo);
			}
			else if(chartwo == '*') {
				do {
					do {
						chartwo = getc(fileone);
					} while(chartwo != '*');
					chartwo = getc(fileone);
				} while(chartwo != '/');
			}
			else
				putc(charone,filetwo);
			charone = getc(fileone);
		}
		else {
			putc(charone,filetwo);
			charone = getc(fileone);
		}
	}
	putc('$',filetwo);
	fclose(fileone);
	fclose(filetwo);
}

void LexicalAnalyzer() {
	fileone = fopen("public/compiler/PreProcess.c","r");
	if(fileone == NULL) {
		printf("Cannot Open File!");
		exit(0);
	}
	charone = getc(fileone);
	printf("Tokens Generated:\n");
}

struct tokenstructure getNextToken() {
	struct tokenstructure tokencur;
	tokenflag = 0;
	while(charone != EOF) {
		int i = 0, flag = 0;
		buf[0] = '\0';
		if(charone == '$') {
			buf[i++] = charone;
			buf[i] = '\0';
			tokencur = StoreToken(buf,row,col-strlen(buf)+1,"EOL");
		}
		else if(charone == '+' || charone == '-') {
			buf[i++] = charone;
			charone = getc(fileone);
			col++;
			if(charone == '=') {
				buf[i++] = charone;
				buf[i] = '\0';
				tokencur = StoreToken(buf,row,col-strlen(buf)+1,"Shorthand Operator");
			}
			else if(charone == '+' || charone == '-') {
				buf[i++] = charone;
				buf[i] = '\0';
				tokencur = StoreToken(buf,row,col-strlen(buf)+1,"Arithmetic Inc/Dec Operator");
			}
			else {
				buf[i] = '\0';
				fseek(fileone,-1,SEEK_CUR);
				col--;
				tokencur = StoreToken(buf,row,col-strlen(buf)+1,"Arithmetic Add/Sub Operator");
			}
		}
		else if(charone == '*' || charone == '/' || charone == '%') {
			buf[i++] = charone;
			charone = getc(fileone);
			col++;
			if(charone == '=') {
				buf[i++] = charone;
				buf[i] = '\0';
				tokencur = StoreToken(buf,row,col-strlen(buf)+1,"Shorthand Operator");
			}
			else {
				buf[i] = '\0';
				fseek(fileone,-1,SEEK_CUR);
				col--;
				tokencur = StoreToken(buf,row,col-strlen(buf)+1,"Arithmetic Mul/Div/Mod Operator");
			}
		}
		else if(charone == '=') {
			buf[i++] = charone;
			charone = getc(fileone);
			col++;
			if(charone == '=') {
				buf[i++] = charone;
				buf[i] = '\0';
				tokencur = StoreToken(buf,row,col-strlen(buf)+1,"Relational Operator");
			}
			else {
				buf[i] = '\0';
				fseek(fileone,-1,SEEK_CUR);
				col--;
				tokencur = StoreToken(buf,row,col-strlen(buf)+1,"Assignment Operator");
			}
		}
		else if(charone == '<' || charone == '>' || charone == '!') {
			buf[i++] = charone;
			charone = getc(fileone);
			col++;
			if(charone == '=')
				buf[i++] = charone;
			else {
				fseek(fileone,-1,SEEK_CUR);
				col--;
			}
			buf[i] = '\0';
			if(!strcmp(buf,"!"))
				tokencur = StoreToken(buf,row,col-strlen(buf)+1,"Logical Operator");
			else
				tokencur = StoreToken(buf,row,col-strlen(buf)+1,"Relational Operator");
		}
		else if(charone == '&' || charone == '|') {
			buf[i++] = charone;
			charone = getc(fileone);
			col++;
			if(charone == '&' || charone == '|')
				buf[i++] = charone;
			else {
				fseek(fileone,-1,SEEK_CUR);
				col--;
			}
			buf[i] = '\0';
			tokencur = StoreToken(buf,row,col-strlen(buf)+1,"Logical Operator");
		}
		else if(charone == '[' || charone == ']' || charone == '(' || charone == ')' || charone == '{' || charone == '}' || charone == ',' || charone == ';' || charone == ':') {
			buf[i++] = charone;
			buf[i] = '\0';
			tokencur = StoreToken(buf,row,col-strlen(buf)+1,"Special Symbol");
		}
		else if(isalpha(charone)) {
			while(isalnum(charone)) {
				buf[i++] = charone;
				charone = getc(fileone);
				col++;
			}
			buf[i] = '\0';
			fseek(fileone,-1,SEEK_CUR);
			col--;
			for (int j = 0; j < 14; j++)
				if(!strcmp(database[j],buf)) {
					flag = 1;
					tokencur = StoreToken(buf,row,col-strlen(buf)+1,"Keyword");
				}
			if(flag == 0)
				tokencur = StoreToken(buf,row,col-strlen(buf)+1,"Identifier");
		}
		else if(isdigit(charone)) {
			while(isdigit(charone)) {
				buf[i++] = charone;
				charone = getc(fileone);
				col++;
			}
			buf[i] = '\0';
			fseek(fileone,-1,SEEK_CUR);
			col--;
			tokencur = StoreToken(buf,row,col-strlen(buf)+1,"Numerical Constant");
		}
		else if(charone == '"') {
			charone = getc(fileone);
			col++;
			while(charone != '"') {
				buf[i++] = charone;
				charone = getc(fileone);
				col++;
			}
			buf[i] = '\0';
			tokencur = StoreToken(buf,row,col-strlen(buf)+1,"Literal");
		}
		else if(charone == '\n') {
			col = 0;
			row++;
		}
		else {
			buf[i] = '\0';
		}
		charone = getc(fileone);
		col++;
		if(tokenflag == 0)
			continue;
		printf("<%s, %d, %d, %s>\n", tokencur.lexemename, tokencur.row, tokencur.col, tokencur.type);
		return tokencur;
	}
}

int Hash(char str[]) {
	int hashno = 0;
	for(int i = 0; str[i] != '\0'; i++)
		hashno += str[i];
	return hashno % HASH;
}

int Search(char str[]) {
	int hashno = Hash(str);
	if(Table[hashno] != NULL) {
		struct Node *temp = Table[hashno];
		while(temp != NULL) {
			if(!strcmp(str, temp -> symbolRow.name))
				return temp -> symbolRow.id;
			temp = temp -> next;
		}
	}
	return 0;
}

void Insert(char nm[], char dt[], int ds, char sc, int ac, int aa[], char rt[]) {
	if(Search(nm) == 1)
		return;
	int hashno = Hash(nm);
	struct Node *cur = (struct Node *)malloc(sizeof(struct Node));
	globalid++;
	cur -> symbolRow.id = globalid;
	strcpy(cur -> symbolRow.name, nm);
	strcpy(cur -> symbolRow.type, dt);
	cur -> symbolRow.size = ds;
	cur -> symbolRow.scope = sc;
	cur -> symbolRow.argc = ac;
	for(int i = 0; i < ac; i++)
		cur -> symbolRow.args[i] = aa[i];
	strcpy(cur -> symbolRow.rettype, rt);
	cur -> next = NULL;
	if(Table[hashno] == NULL)
		Table[hashno] = cur;
	else {
		struct Node *temp = Table[hashno];
		while(temp -> next != NULL)
			temp = temp -> next;
		temp -> next = cur;
	}
}

void SymbolTable() {
	int flagone = 0, x = 0, arg = 0, arind = 0, datasize[5] = {1,4,1,4,8};
	char typetemp[100] = "NULL", scope = 'G', datatype[5][10] = {"void","int","char","float","double"};
	for(int i = 0; i < ind; i++) {
		if(!strcmp(token[i].type,"Identifier") && Search(token[i].lexemename) == 0) {
			int argarray[10] = {0};
			for(int j = i - 1; j >= 0; j--) {
				flagone = 0, x = 0;
			 	if(!strcmp(token[j].type,"Keyword"))
					for(x = 0; x < 5; x++)
		 				if(!strcmp(datatype[x],token[j].lexemename)) {
		 					strcpy(typetemp,token[j].lexemename);
		 					flagone = 1;
		 					break;
		 				}
				if(flagone)
					break;
			}
			if(!strcmp(token[i+1].lexemename,"(")) {
				scope = 'G';
				if(!strcmp(token[i+2].lexemename,")"))
					arg = 0;
				else {
					for(int j = i + 1; j < ind; j++) {
						if(!strcmp(token[j].lexemename,")")) 
							break;
						if(!strcmp(token[j].lexemename,","))
							arg++;
					}
					arg++;
					for(int j = 0; j < arg; j++)
						argarray[j] = globalid + j + 2;
				}
				Insert(token[i].lexemename, "func", 0, scope, arg, argarray, typetemp);
				scope = 'L';
			}
			else {
				arind = 1;
				if(arg != 0) {
					scope = 'X';
					arg--;
				}
				else if(scope != 'G')
					scope = 'L';
				if(!strcmp(token[i+1].lexemename,"["))
					arind = atoi(token[i+2].lexemename);
				Insert(token[i].lexemename, typetemp, datasize[x] * arind, scope, -1, argarray, "NULL");
			}
		}

	}
}

void Display() {
	printf("Symbol Table:\n");
	for(int x = 0; x <= globalid; x++)
		for(int i = 0; i < MAX; i++)
			if(Table[i] != NULL) {
				struct Node *temp = Table[i];
				while(temp != NULL) {
					struct symbolNode temp2 = temp -> symbolRow;
					if(temp2.id == x) {
						printf("-------------------------------------------------------------------------\n");
						printf("| %d\t| %s\t| %s\t", temp2.id, temp2.name, temp2.type);
						if(temp2.size == 0)
							printf("| \t");
						else
							printf("| %d\t", temp2.size);
						if(temp2.scope == 'X')
							printf("| \t");
						else
							printf("| %c\t", temp2.scope);
						if(temp2.argc == -1)
							printf("| \t| \t\t| \t");
						else
							printf("| %d\t", temp2.argc);
						if(temp2.argc == 0)
							printf("| NULL\t\t");
						else if(temp2.argc > 0) {
							printf("| ");
							for(int j = 0; j < temp2.argc; j++)
								printf("<id,%d>", temp2.args[j]);
							printf("\t");
						}
						if(strcmp(temp2.rettype,"NULL"))
							printf("| %s\t",temp2.rettype);
						printf("|\n");
					}
					temp = temp -> next;
				}
			}
	printf("-------------------------------------------------------------------------\n\n");
	// for(int i = 0; i < ind; i++) {
	// 	if(!strcmp(token[i].type, "Identifier"))
	//  		printf("<id,%d> ", Search(token[i].lexemename));
	//  	else if(!strcmp(token[i].type, "Numerical Constant"))
	//  		printf("<num,%s> ", token[i].lexemename);
	//  	else
	//  		printf("<%s> ", token[i].lexemename);
	//  	if(!strcmp(token[i].lexemename,";") || !strcmp(token[i].lexemename,"{") || !strcmp(token[i].lexemename,"}") || !strcmp(token[i].lexemename,")"))
	// 		printf("\n");
	// }
	printf("Tokens Generated:\n");
	for(int i = 0; i < ind; i++)
		printf("<%s, %d, %d, %s>\n", token[i].lexemename, token[i].row, token[i].col, token[i].type);
	printf("\n");
}

void LexClose() {
	fclose(fileone);
	SymbolTable();
	//Display();
}