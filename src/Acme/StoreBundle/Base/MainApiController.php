<?php

namespace Acme\StoreBundle\Base;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Acme\StoreBundle\Base\ApiResponse;

class MainApiController extends Controller
{
    public function getCurrentEntityName()
    {
        $arrayMaches = [];
        $className   = get_class($this);
        preg_match('/^Acme\\\StoreBundle\\\Controller\\\(.*)Controller/', $className, $arrayMaches);
        return end($arrayMaches);
    }
    public function getCurrentForm($entityName)
    {
        return "Acme\StoreBundle\Form\\{$entityName}Type";
    }

    public function getCurrentEntityPath($entityName)
    {
        return "Acme\StoreBundle\Entity\\{$entityName}";
    }

    public function indexAction()
    {
        $arrThisClass = explode("/", get_class($this));
        $lastElement  = end($arrThisClass);
        $currentEntityName = $this->getCurrentEntityName();
        if (!$currentEntityName) {
            return ApiResponse::bad('Controller name is not valid.');
            
        }

        $em         = $this->getDoctrine()->getManager();
        $entities   = $em->getRepository("AcmeStoreBundle:{$currentEntityName}")->findAll();
        $ret = [];
        
        foreach ($entities as $entity) {
            $ret[]   = $entity -> toArray();
        }
        return ApiResponse::ok($ret);
    }

    public function editAction(Request $request, $id)
    {
        $data    = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            $data = json_decode($content, true); // 2nd param to get as array
        }
        $em = $this->getDoctrine()->getManager();
        $currentEntityName = $this->getCurrentEntityName();
        if (!$currentEntityName) {
            return ApiResponse::bad('Controller name is not valid.');
        }
        $entity = $em->getRepository("AcmeStoreBundle:{$currentEntityName}")->findOneById($id);
        if (!$entity) {
            return ApiResponse::bad('Unable to find Category entity.');
        }
        
        $entityForm = $this->getCurrentForm($currentEntityName);

        $form           = $this->createForm(new $entityForm, $entity); 
        $relationFields = $form->all();
        $data           = array_intersect_key($data, $relationFields);

        $form->submit($data);
        if ($form->isValid()) {
            $this->populateEntityRelations($entity);
            $em->persist($entity);
            $em->flush();
            return ApiResponse::ok($entity->toArray());
        } else {
            $errors = $this->getFormErrorMessages($form);
            return ApiResponse::bad($errors);
        }
    }

    public function createAction(Request $request)
    {
        $content = $request->getContent();
        if (!empty($content))
        {
            $data = json_decode($content, true); // 2nd param to get as array
        }
        $em                = $this->getDoctrine()->getManager();
        $currentEntityName = $this->getCurrentEntityName();

        $entityClassName = $this->getCurrentEntityPath($currentEntityName);
        $entity          = new $entityClassName;
        $entityForm      = $this->getCurrentForm($currentEntityName);
        $form            = $this->createForm(new $entityForm, $entity); 
        $relationFields  = $form->all();
        $data            = array_intersect_key($data, $relationFields);
        $form->submit($data);
        if ($form->isValid()) {
            $this->populateEntityRelations($entity);
            $em->persist($entity);
            $em->flush();
           return ApiResponse::ok($entity->toArray());
        } else {
            $errors = $this->getFormErrorMessages($form);
            return ApiResponse::bad($errors);
        }
    }

    public function deleteAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $currentEntityName = $this->getCurrentEntityName();
        if (!$currentEntityName) {
            return ApiResponse::bad('Controller name is not valid.');
        }
        $entity = $em->getRepository("AcmeStoreBundle:{$currentEntityName}")->findOneById($id);
        if (!$entity) {
            return ApiResponse::bad('Unable to find Category entity.');
        }
        $oldEntity = clone($entity);        
        $em->remove($entity);
        $em->flush();

        return ApiResponse::ok($entity->toArray());
    }

    private function populateEntityRelations ($entity)
    {
        $em       = $this->getDoctrine()->getManager();
        $metadata = $em->getClassMetaData(get_class($entity));
        if (!empty($metadata->associationMappings)) {

          foreach ($metadata->associationMappings as $relation) {
            $targetEntityClass = $relation['targetEntity'];
            $method          = 'get' . ucfirst($relation['fieldName']);

            if( !method_exists($entity, $method.'Id') ){
              continue;
            }
            
            $relEntityId = $entity->{$method.'Id'}();
            /**
             * was is_numeric($relEntityId) but now we use UUID strategy for fields `id`
             * this way we can check only if id is set
             * 
            **/
            if ( $relEntityId ) {
                $relObject = $em->find($targetEntityClass, $relEntityId);
                $set_method = 'set' . ucfirst($relation['fieldName']);
                $entity->{$set_method}($relObject);
            }
          }
        }
    }

    public function getFormErrorMessages ($form)
      {
        $errorsArr = [];
        // @var Symfony\Component\Form\FormErrorIterator $form->getErrors(true)
        foreach ($form->getErrors(true) as $key => $error) {
          $errorsArr[] = $error->getMessage();
        }
        return $errorsArr;
      }
}



