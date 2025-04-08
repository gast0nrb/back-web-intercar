# Variables configurables
API_URL ?=http://localhost:8080/api/intercar/
ID ?=1
VALUE ?=TestName
FK_VALUE ?=1

# comandos para probar la api
.PHONY: getcategories postcategories putcategory

#METODOS DE CATEGORIA

#obtener categorias
getcategories:
	@@echo "Ejecutando get..."
	curl -X GET "$(API_URL)/category" \
		-H "Content-type: application/json" 

#crear una categoria
postcategory:
	@@echo "Creando una categoria.."
	curl -X POST "$(API_URL)/category" \
		-H "Content-type: application/json" \
		-d '{"name" : "$(VALUE)"}'

#update categoria
putcategory:
	@@echo "Editando categoria..."
	curl -X PUT "$(API_URL)/category/$(ID)" \
		-H "Content-type: application/json" \
		-d '{"name" : "$(VALUE)"}'

#delete categoria
deletecategory:
	@@echo "Eliminando categoria con el id $(ID)"
	curl -X DELETE "$(API_URL)/category/$(ID)" \
		-H "Content-type: applicaton/json"

#METODOS DE SUBCATEGORIA

#Obtener subcategorias
getsubcategories:
	@@echo "Obteniendo subcategorias"
	curl -X GET "$(API_URL)/subcategories" \
		-H "Content-type: application/json"



help:
	@echo "----------------------"
	@echo "End points disponibles"
	@echo "----------------------"
	@echo "Categories: /api/intercar/category"
	@echo "Metodos :"
	@echo  "GET : getcategories | POST : postcategory "
	@echo "Categories: /api/intercar/category/:id"
	@echo "Metodos: "
	@echo  "PUT : putcategory | DELETE : deletecategory "
	@echo "--------------------------------------------"
	@echo "VARIABLES:"
	@echo "VALUE: {default : 'TestName'}"
	@echo "ID: {default : 1}"
