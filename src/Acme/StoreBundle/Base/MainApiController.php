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

    public function generateResponse($jsonContent)
    {
        $response = new Response($jsonContent);
        $response->headers->set('Content-Type', 'application/json');
        return $response;   
    }

    public function indexAction()
    {

        // var_dump(get_class($this));
        
        $em         = $this->getDoctrine()->getManager();
        $categories = $em->getRepository('AcmeStoreBundle:Category')->findAll();
        $encoders   = array(new XmlEncoder(), new JsonEncoder());
        $normalizers= array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        $ret = [];
        
        foreach ($categories as $category) {
            $ret[]   = $category -> toArray();
        }

        $jsonContent = $serializer->serialize($ret,'json');
        return $this->generateResponse($jsonContent);
    }

    public function editAction(Request $request, $id)
    {
        $data = array();
        $content = $this->get("request")->getContent();
        if (!empty($content))
        {
            $data = json_decode($content, true); // 2nd param to get as array
        }
        $em = $this->getDoctrine()->getManager();
        $entity = $em->getRepository('AcmeStoreBundle:Category')->findOneById($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Category entity.');
        }
        $entityForm = "Acme\StoreBundle\Form\CategoryType";

        $form           = $this->createForm(new $entityForm, $entity)->add('submit','submit'); 
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

    protected function getJson($data) {
        $encoders    = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer  = new Serializer($normalizers, $encoders);
        $jsonContent = $serializer->serialize($data,'json');
        return $jsonContent;
    }

}
