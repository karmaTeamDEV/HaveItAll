<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class IndustryAPI_model extends CI_Model {

    protected $industryTable = 'industry';
    protected $areaTable = 'functional_area';
    protected $companyTable = 'company_master';

    public function __construct() {
        parent::__construct();
    }

    public function getindustries() {
        $this->db->select('*');
        $this->db->order_by('industry_id', 'asc');
        $result = $this->db->get($this->industryTable);
        return $result->result_array();
    }

    public function getarealist($id) {
        $this->db->select('*');
        if ($id) {
            $this->db->where('industry_id', $id);
        }
        $this->db->order_by('area_id', 'asc');
        $result = $this->db->get($this->areaTable);
        return $result->result_array();
    }

    public function get_single_industry($industryID = FALSE) {
        $this->db->select('*');
        if ($industryID) {
            $this->db->where('industry_id', $industryID);
        }

        $result = $this->db->get($this->industryTable);
        return $result->result_array();
    }
    public function get_single_functionalarea($id = FALSE) {
        $this->db->select('*');
        if ($id) {
            $this->db->where('area_id', $id);
        }

        $result = $this->db->get($this->areaTable);
        return $result->result_array();
    }

    public function check_duplicateIndustry($industryName,$activeStatus){
        $this->db->select('*');
        $this->db->where('industry_name', $industryName);
        $this->db->where('industry_status', $activeStatus);
        $result = $this->db->get($this->industryTable);
       // echo $this->db->last_query();
        return $result->result_array();
    }

    public function fetch_inactiveIndustries($industryName){
     $this->db->select('*');
     $this->db->where('industry_name', $industryName);
     $this->db->where('industry_status', '1');
     $result = $this->db->get($this->industryTable);
       // echo $this->db->last_query();
     return $result->result_array(); 
 }

 public function add_industry($data){
    $this->db->insert($this->industryTable, $data); 
    //echo $this->db->last_query(); exit;    
    return $this->db->insert_id();
}

public function edit_industry($industryID,$data){
    $this->db->where('industry_id', $industryID);
    $this->db->update($this->industryTable, $data); 
    //echo $this->db->last_query(); exit;    
    $affectedRows = $this->db->affected_rows();
    if($affectedRows >= 0){
        return $industryID;
    } else {
        return -1;
    }    

}

public function edit_area($industryID,$data){
    $this->db->where('area_id', $industryID);
    $this->db->update($this->areaTable, $data); 
    $affectedRows = $this->db->affected_rows();
    if($affectedRows >= 0){
        return $industryID;
    } else {
        return -1;
    }    

}

public function insert_cmn_tbl($table,$data){
        if($this->db->insert($table, $data)){
            //echo $this->db->last_query();
            return $this->db->insert_id();
        }       
        
    } 

public function getcompanies() {
    $this->db->select('*');
    $this->db->order_by('company_id', 'desc');
    $result = $this->db->get($this->companyTable);
    return $result->result_array();
}

public function get_single_company($companyID = FALSE) {
    $this->db->select('*');
    if ($companyID) {
        $this->db->where('company_id', $companyID);
    }

    $result = $this->db->get($this->companyTable);
    return $result->result_array();
}

public function check_duplicateCompany($companyName,$activeStatus){
    $this->db->select('*');
    $this->db->where('company_name', $companyName);
    $this->db->where('company_status', $activeStatus);
    $result = $this->db->get($this->companyTable);
       // echo $this->db->last_query();
    return $result->result_array();
}

public function fetch_inactiveCompanies($companyName){
   $this->db->select('*');
   $this->db->where('company_name', $companyName);
   $this->db->where('company_status', '1');
   $result = $this->db->get($this->companyTable);
       // echo $this->db->last_query();
   return $result->result_array(); 
}

public function add_company($data){
    $this->db->insert($this->companyTable, $data); 
    //echo $this->db->last_query(); exit;    
    return $this->db->insert_id();
}

public function edit_company($companyID,$data){
    $this->db->where('company_id', $companyID);
    $this->db->update($this->companyTable, $data); 
    $affectedRows = $this->db->affected_rows();
    if($affectedRows >= 0){
        return $companyID;
    } else {
        return -1;
    }    
 }
}
