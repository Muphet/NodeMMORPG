define(function(){
	/**
	* Represents a physic body.
	* @module lib
	* @submodule lib_Shared
	* @class lib_Shared_Physics_Body
	**/
	function Body(){
		
	}
	var p = Body.prototype;
	
	/**
	* Left coordinate of the BB.
	* @property left
	* @default 0
	**/
	p.left = 0;
	
	/**
	* Right coordinate of the BB.
	* @property right
	* @default 0
	**/
	p.right = 0;
	p.top = 0;
	p.bottom = 0;
});