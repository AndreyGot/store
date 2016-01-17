<?php

namespace Acme\StoreBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Acme\StoreBundle\Base\MainApiController;

/**
 * Category controller.
 *
 * @Route("/category")
 */
class CategoryController extends MainApiController
{
    /**
     * Lists all Category entities.
     * @Route("", name="category")
     * @Method("GET")
     */
    public function indexAction()
    {
        return parent::indexAction();
    }

    /**
     * Edit a new Category entity.
     * @Route("/{id}", defaults={"_format"="json"}, requirements={"_method"="PUT", "id"="[\d-]+"})
     * @Method("PUT")
     */
    public function editAction(Request $request, $id)
    {
        return parent::editAction($request, $id);
    }

    /**
     * Creates a new Category entity.
     * @Route("", defaults={"_format"="json"}, requirements={"_method"="POST"})
     * @Method("POST")
     */
    public function createAction(Request $request)
    {
        return parent::createAction($request);
    }

    /**
     * Delete a new Category entity.
     * @Route("/{id}", defaults={"_format"="json"}, requirements={"_method"="DELETE", "id"="[\d-]+"})
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, $id)
    {
        return parent::deleteAction($request, $id);
    }
}
