//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugmarshaller')

//@Export('AnnotateMarshaller')

//@Require('bugmarshaller.EntityAnnotation')
//@Require('bugmarshaller.PropertyAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var EntityAnnotation =      bugpack.require('bugmarshaller.EntityAnnotation');
var PropertyAnnotation =    bugpack.require('bugmarshaller.PropertyAnnotation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AnnotateMarshaller = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @return {EntityAnnotation}
 */
AnnotateMarshaller.entity = function() {
    return new EntityAnnotation();
};

/**
 * @return {PropertyAnnotation}
 */
AnnotateMarshaller.property = function(name) {
    return new PropertyAnnotation(name);
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugmarshaller.AnnotateMarshaller', AnnotateMarshaller);
