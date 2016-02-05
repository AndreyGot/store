<?php

namespace Acme\StoreBundle\Base;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class ApiResponse
{
   static protected function getJson($data) {
    $encoders    = array(new XmlEncoder(), new JsonEncoder());
    $normalizers = array(new ObjectNormalizer());
    $serializer  = new Serializer($normalizers, $encoders);
    $jsonContent = $serializer->serialize($data,'json');
    return $jsonContent;
  }

	static public function ok ($data) {
		$responseData = array("message" => "ok","data" => $data);
		$response     = new Response(ApiResponse::getJson($responseData),Response::HTTP_OK);
		$response->headers->set('Content-Type', 'application/json');
		return $response;
	}

	static public function bad ($data) {
		$responseData = array("message" => "bad", "data" => $data);
		$response     = new Response(ApiResponse::getJson($responseData),Response::HTTP_BAD_REQUEST);
		$response->headers->set('Content-Type', 'application/json');
		return $response;
	}
}