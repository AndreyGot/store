<?php

namespace Acme\StoreBundle\Base;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

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

    public function generateResponse($jsonContent)
    {
        $response = new Response($jsonContent);
        $response->headers->set('Content-Type', 'application/json');
        return $response;   
    }

    public function indexAction()
    {
        $arrThisClass = explode("/", get_class($this));
        $lastElement  = end($arrThisClass);
        $currentEntityName = $this->getCurrentEntityName();
        if (!$currentEntityName) {
            return new Response($this->getJson('Controller name is not valid.'));
        }

        $em         = $this->getDoctrine()->getManager();
        $entities    = $em->getRepository("AcmeStoreBundle:{$currentEntityName}")->findAll();
        $encoders   = array(new XmlEncoder(), new JsonEncoder());
        $normalizers= array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        $ret = [];
        
        foreach ($entities as $category) {
            $ret[]   = $category -> toArray();
        }

        $jsonContent = $serializer->serialize($ret,'json');
        return $this->generateResponse($jsonContent);
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
            return new Response($this->getJson('Controller name is not valid.'));
        }
        $entity = $em->getRepository("AcmeStoreBundle:{$currentEntityName}")->findOneById($id);
        if (!$entity) {
            return new Response($this->getJson('Unable to find Category entity.'));
        }
        
        $entityForm = $this->getCurrentForm($currentEntityName);

        $form           = $this->createForm(new $entityForm, $entity); 
        $relationFields = $form->all();
        $data           = array_intersect_key($data, $relationFields);

        $form->submit($data);
        if ($form->isValid()) {
            $em->persist($entity);
            $em->flush();
            return new Response($this->getJson($entity->toArray()));
        } else {
            $errors = $form->getErrors();
            return new Response($this->getJson($errors));
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
            $em->persist($entity);
            $em->flush();
            return new Response($this->getJson($entity->toArray()));
        } else {
            $errors = $form->getErrors();
            return new Response($this->getJson($errors));
        }
    }

    public function deleteAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $currentEntityName = $this->getCurrentEntityName();
        if (!$currentEntityName) {
            return new Response($this->getJson('Controller name is not valid.'));
        }
        $entity = $em->getRepository("AcmeStoreBundle:{$currentEntityName}")->findOneById($id);
        if (!$entity) {
            return new Response($this->getJson('Unable to find Category entity.'));
        }
        $oldEntity = clone($entity);        
        $em->remove($entity);
        $em->flush();
        return new Response($this->getJson($oldEntity->toArray()));
    }

    protected function getJson($data) {
        $encoders    = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer  = new Serializer($normalizers, $encoders);
        $jsonContent = $serializer->serialize($data,'json');
        return $jsonContent;
    }
}
